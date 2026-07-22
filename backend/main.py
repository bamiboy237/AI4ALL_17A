from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
from io import BytesIO
import os
from typing import Dict, List

app = FastAPI(
    title="Skin Lesion Classification API",
    description="API for classifying skin lesions as benign or malignant using HAM10000 and DDI datasets"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATHS = {
    "ham10000": os.path.join(BASE_DIR, "ham10000_cnn_improved.keras"),
    "ddi": os.path.join(BASE_DIR, "ddi_cnn_improved.keras"),
}

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


def load_models():
    """Load all pre-trained models."""
    global models
    for model_name, model_path in MODEL_PATHS.items():
        if os.path.exists(model_path):
            try:
                models[model_name] = tf.keras.models.load_model(model_path)
                print(f"✓ Loaded {model_name} model")
            except Exception as e:
                print(f"✗ Failed to load {model_name} model: {str(e)}")
        else:
            print(f"✗ Model file not found: {model_path}")


def preprocess_image(image: Image.Image, model_name: str = "ham10000") -> np.ndarray:
    """Preprocess image for model prediction."""
    # All models expect 75x100 input
    target_size = (100, 75)  # width, height for PIL

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


@app.on_event("startup")
async def startup_event():
    """Load models on startup."""
    load_models()


@app.get("/health")
async def health_check() -> Dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "models_loaded": list(models.keys()),
    }


@app.get("/models")
async def get_available_models() -> Dict:
    """Get list of available models."""
    return {
        "available_models": list(models.keys()),
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


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model: str = "ham10000"
) -> Dict:
    """
    Predict if a skin lesion is benign or malignant.

    Args:
        file: Image file of the skin lesion
        model: Model to use ("ham10000" or "ddi")

    Returns:
        Classification result with confidence scores
    """
    if model not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{model}' not loaded. Available: {list(models.keys())}"
        )

    try:
        # Read image
        contents = await file.read()
        image = Image.open(BytesIO(contents))

        # Preprocess
        processed_image = preprocess_image(image, model_name=model)

        # Predict
        predictions = models[model].predict(processed_image, verbose=0)

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

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")


@app.post("/predict-batch")
async def predict_batch(
    files: List[UploadFile] = File(...),
    model: str = "ham10000"
) -> Dict:
    """Process multiple images at once."""
    if model not in models:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{model}' not loaded. Available: {list(models.keys())}"
        )

    results = []

    for file in files:
        try:
            contents = await file.read()
            image = Image.open(BytesIO(contents))
            processed_image = preprocess_image(image, model_name=model)
            predictions = models[model].predict(processed_image, verbose=0)

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

        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e),
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
