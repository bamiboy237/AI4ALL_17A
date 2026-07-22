from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
from io import BytesIO
import gc
import os
from threading import Lock
from typing import Dict, List, Tuple

app = FastAPI(
    title="Skin Lesion Classification API",
    description="API for classifying skin lesions as benign or malignant using HAM10000 and DDI datasets"
)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATHS = {
    "ham10000": os.path.join(BASE_DIR, "ham10000_cnn_improved.keras"),
    "ddi": os.path.join(BASE_DIR, "ddi_cnn_improved.keras"),
}
API_PREFIX = "/api"
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", "4500000"))
MODEL_LOCK = Lock()

HAM10000_CLASSES = {
    0: "Melanoma",
    1: "Melanocytic nevus",
    2: "Basal cell carcinoma",
    3: "Actinic keratosis",
    4: "Benign keratosis",
    5: "Dermatofibroma",
    6: "Vascular lesion"
}

DDI_CLASSES = {
    0: "Melanoma",
    1: "Non-melanoma (Benign)",
}

models = {}


def load_model(model_name: str):
    """Load one model, releasing any previously loaded model first."""
    if model_name not in MODEL_PATHS:
        raise ValueError(f"Unknown model: {model_name}")

    if model_name in models:
        return models[model_name]

    model_path = MODEL_PATHS[model_name]
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")

    models.clear()
    tf.keras.backend.clear_session()
    gc.collect()
    models[model_name] = tf.keras.models.load_model(model_path)
    print(f"✓ Loaded {model_name} model")
    return models[model_name]


def preprocess_image(image: Image.Image, model_name: str = "ham10000") -> np.ndarray:
    """Preprocess image for model prediction."""
    input_shape = models[model_name].input_shape
    if not isinstance(input_shape, tuple) or len(input_shape) != 4:
        raise ValueError(f"Unsupported input shape for {model_name}: {input_shape}")

    _, height, width, channels = input_shape
    if height is None or width is None or channels != 3:
        raise ValueError(f"Unsupported input shape for {model_name}: {input_shape}")

    target_size: Tuple[int, int] = (width, height)  # PIL uses (width, height)

    # Resize image
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    # Convert to RGB if grayscale
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Convert to numpy array and normalize
    img_array = np.array(image, dtype=np.float32)
    img_array = img_array / 255.0

    # HAM ANN model requires flattened input
    if model_name == "ham_ann":
        img_array = img_array.flatten()
        return np.expand_dims(img_array, axis=0)

    # CNN models use 4D input (batch, height, width, channels)
    return np.expand_dims(img_array, axis=0)


def get_benign_malignant_class(model_name: str, predictions: np.ndarray) -> tuple:
    """Convert model predictions to benign/malignant classification."""
    if model_name == "ddi":
        # DDI model directly outputs benign (1) or malignant (0)
        pred_class = np.argmax(predictions[0])
        confidence = float(predictions[0][pred_class])
        return ("Melanoma (Malignant)" if pred_class == 0 else "Non-melanoma (Benign)", confidence)

    elif model_name == "ham10000":
        # HAM10000: Classes 0, 2, 3 are malignant; 1, 4, 5, 6 are benign
        malignant_classes = {0, 2, 3}  # Melanoma, BCC, Actinic keratosis
        pred_class = np.argmax(predictions[0])
        confidence = float(predictions[0][pred_class])

        is_malignant = pred_class in malignant_classes
        classification = "Malignant (Requires Medical Attention)" if is_malignant else "Benign"

        return (classification, confidence)


@app.get(f"{API_PREFIX}/health")
async def health_check() -> Dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "models_loaded": list(models.keys()),
        "available_models": list(MODEL_PATHS.keys()),
        "model_loading": "lazy",
    }


@app.get(f"{API_PREFIX}/models")
async def get_available_models() -> Dict:
    """Get list of available models."""
    return {
        "available_models": list(MODEL_PATHS.keys()),
        "loaded_models": list(models.keys()),
        "models": {
            "ham10000": {
                "name": "HAM10000 CNN",
                "dataset": "HAM10000 (10,000 skin images)",
                "classes": len(HAM10000_CLASSES),
            },
            "ddi": {
                "name": "DDI CNN",
                "dataset": "DDI (Dermoscopy Dataset)",
                "classes": len(DDI_CLASSES),
            },
        },
    }


async def read_upload(file: UploadFile) -> Image.Image:
    """Validate and decode an uploaded image within Vercel's body-size limit."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Upload an image file.")

    contents = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Image must be {MAX_UPLOAD_BYTES // 1_000_000} MB or smaller.",
        )

    try:
        with Image.open(BytesIO(contents)) as image:
            image.verify()
        return Image.open(BytesIO(contents))
    except Exception as error:
        raise HTTPException(status_code=400, detail="Upload a valid image file.") from error


@app.post(f"{API_PREFIX}/predict")
async def predict(
    file: UploadFile = File(...),
    model: str = Form("ham10000"),
) -> Dict:
    """
    Predict if a skin lesion is benign or malignant.

    Args:
        file: Image file of the skin lesion
        model: Model to use ("ham10000" or "ddi")

    Returns:
        Classification result with confidence scores
    """
    if model not in MODEL_PATHS:
        raise HTTPException(
            status_code=400, detail=f"Unknown model. Available: {list(MODEL_PATHS.keys())}"
        )

    try:
        image = await read_upload(file)
        with MODEL_LOCK:
            loaded_model = load_model(model)
            processed_image = preprocess_image(image, model_name=model)
            predictions = loaded_model.predict(processed_image, verbose=0)

        # Get classification
        classification, confidence = get_benign_malignant_class(model, predictions)

        # Get detailed predictions
        classes_dict = DDI_CLASSES if model == "ddi" else HAM10000_CLASSES
        detailed_predictions = {
            classes_dict[i]: float(predictions[0][i])
            for i in range(len(predictions[0]))
        }

        return {
            "status": "success",
            "model": model,
            "classification": classification,
            "confidence": confidence,
            "detailed_predictions": detailed_predictions,
            "warning": "This prediction should not be used for medical diagnosis. Consult a dermatologist for professional evaluation.",
        }

    except HTTPException:
        raise
    except (FileNotFoundError, OSError) as error:
        raise HTTPException(status_code=503, detail="The selected model is unavailable.") from error
    except Exception as error:
        raise HTTPException(status_code=400, detail="Error processing image.") from error


@app.post(f"{API_PREFIX}/predict-batch")
async def predict_batch(
    files: List[UploadFile] = File(...),
    model: str = Form("ham10000"),
) -> Dict:
    """Process multiple images at once."""
    if model not in MODEL_PATHS:
        raise HTTPException(
            status_code=400, detail=f"Unknown model. Available: {list(MODEL_PATHS.keys())}"
        )

    results = []

    for file in files:
        try:
            image = await read_upload(file)
            with MODEL_LOCK:
                loaded_model = load_model(model)
                processed_image = preprocess_image(image, model_name=model)
                predictions = loaded_model.predict(processed_image, verbose=0)

            classification, confidence = get_benign_malignant_class(model, predictions)

            classes_dict = DDI_CLASSES if model == "ddi" else HAM10000_CLASSES
            detailed_predictions = {
                classes_dict[i]: float(predictions[0][i])
                for i in range(len(predictions[0]))
            }

            results.append({
                "filename": file.filename,
                "classification": classification,
                "confidence": confidence,
                "detailed_predictions": detailed_predictions,
            })

        except Exception:
            results.append({
                "filename": file.filename,
                "error": "Error processing image.",
            })

    return {
        "status": "success",
        "model": model,
        "total_images": len(files),
        "results": results,
        "warning": "These predictions should not be used for medical diagnosis. Consult a dermatologist for professional evaluation.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
