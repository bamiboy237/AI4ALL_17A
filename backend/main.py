import gc
import os
from io import BytesIO
from pathlib import Path
from threading import Lock
from typing import Dict, List, Tuple

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image

app = FastAPI(
    title="DermAware API",
    description="Research API for skin-lesion image classification.",
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
    "ham10000_b0": os.path.join(BASE_DIR, "ham10000_efficientnet_b0.keras"),
    "ddi": os.path.join(BASE_DIR, "ddi_cnn_improved.keras"),
}
FRONTEND_BUILD_DIR = Path(BASE_DIR) / "frontend" / "build"
API_PREFIX = "/api"
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", "4500000"))
MODEL_LOCK = Lock()

HAM10000_CLASSES = {
    0: "Actinic keratosis",
    1: "Basal cell carcinoma",
    2: "Benign keratosis",
    3: "Dermatofibroma",
    4: "Melanocytic nevus",
    5: "Melanoma",
    6: "Vascular lesion",
}

DDI_CLASSES = {
    0: "Actinic keratosis",
    1: "Adnexal tumor",
    2: "Basal cell carcinoma",
    3: "Benign keratosis",
    4: "Other benign lesion",
    5: "Dermatofibroma",
    6: "Infection",
    7: "Inflammatory condition",
    8: "Melanocytic nevus",
    9: "Melanoma",
    10: "Other malignancy",
    11: "Other or miscellaneous",
    12: "Physical or traumatic lesion",
    13: "Soft-tissue tumor",
    14: "Squamous cell carcinoma",
    15: "Vascular lesion",
}

MODEL_CLASSES = {
    "ham10000": HAM10000_CLASSES,
    "ham10000_b0": HAM10000_CLASSES,
    "ddi": DDI_CLASSES,
}

MODEL_DETAILS = {
    "ham10000": {
        "name": "HAM10000 CNN",
        "dataset": "HAM10000",
    },
    "ham10000_b0": {
        "name": "EfficientNet-B0",
        "dataset": "HAM10000",
    },
    "ddi": {
        "name": "DDI CNN",
        "dataset": "Diverse Dermatology Images",
    },
}

STANDARDIZATION = {
    "ham10000": (159.83858404060575, 46.347782320788426),
    "ddi": (125.3272191837383, 62.37661912263565),
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
    models[model_name] = tf.keras.models.load_model(model_path, compile=False)
    print(f"✓ Loaded {model_name} model")
    return models[model_name]


def preprocess_image(image: Image.Image, model_name: str = "ham10000") -> np.ndarray:
    """Prepare an image with the preprocessing used during model training."""
    input_shape = models[model_name].input_shape
    if not isinstance(input_shape, tuple) or len(input_shape) != 4:
        raise ValueError(f"Unsupported input shape for {model_name}: {input_shape}")

    _, height, width, channels = input_shape
    if height is None or width is None or channels != 3:
        raise ValueError(f"Unsupported input shape for {model_name}: {input_shape}")

    target_size: Tuple[int, int] = (width, height)  # PIL uses (width, height)

    image = image.resize(target_size, Image.Resampling.LANCZOS)

    if image.mode != "RGB":
        image = image.convert("RGB")

    img_array = np.array(image, dtype=np.float32)

    if model_name in STANDARDIZATION:
        mean, standard_deviation = STANDARDIZATION[model_name]
        img_array = (img_array - mean) / standard_deviation
    elif model_name != "ham10000_b0":
        raise ValueError(f"Unsupported preprocessing for model: {model_name}")

    return np.expand_dims(img_array, axis=0)


def get_prediction_summary(model_name: str, predictions: np.ndarray) -> tuple:
    """Return the display label, highest score, and result style."""
    classes = MODEL_CLASSES[model_name]
    scores = predictions[0]

    if len(scores) != len(classes):
        raise ValueError(
            f"{model_name} returned {len(scores)} scores for {len(classes)} labels."
        )

    predicted_index = int(np.argmax(scores))
    confidence = float(scores[predicted_index])

    if model_name == "ddi":
        return (classes[predicted_index], confidence, "neutral")

    if model_name in ("ham10000", "ham10000_b0"):
        malignant_classes = {0, 1, 5}
        is_malignant = predicted_index in malignant_classes
        classification = (
            "Malignant (Requires Medical Attention)" if is_malignant else "Benign"
        )
        result_type = "malignant" if is_malignant else "benign"
        return (classification, confidence, result_type)

    raise ValueError(f"Unsupported model: {model_name}")


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
            model_name: {
                **MODEL_DETAILS[model_name],
                "classes": len(MODEL_CLASSES[model_name]),
            }
            for model_name in MODEL_PATHS
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
        raise HTTPException(
            status_code=400, detail="Upload a valid image file."
        ) from error


@app.post(f"{API_PREFIX}/predict")
async def predict(
    file: UploadFile = File(...),
    model: str = Form("ham10000"),
) -> Dict:
    """Return research-model scores for one uploaded image."""
    if model not in MODEL_PATHS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model. Available: {list(MODEL_PATHS.keys())}",
        )

    try:
        image = await read_upload(file)
        with MODEL_LOCK:
            loaded_model = load_model(model)
            processed_image = preprocess_image(image, model_name=model)
            predictions = loaded_model.predict(processed_image, verbose=0)

        classification, confidence, result_type = get_prediction_summary(
            model, predictions
        )

        classes_dict = MODEL_CLASSES[model]
        detailed_predictions = {
            classes_dict[i]: float(predictions[0][i])
            for i in range(len(predictions[0]))
        }

        return {
            "status": "success",
            "model": model,
            "classification": classification,
            "confidence": confidence,
            "result_type": result_type,
            "detailed_predictions": detailed_predictions,
            "warning": "This prediction should not be used for medical diagnosis. Consult a dermatologist for professional evaluation.",
        }

    except HTTPException:
        raise
    except (FileNotFoundError, OSError) as error:
        raise HTTPException(
            status_code=503, detail="The selected model is unavailable."
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=400, detail="Error processing image."
        ) from error


@app.post(f"{API_PREFIX}/predict-batch")
async def predict_batch(
    files: List[UploadFile] = File(...),
    model: str = Form("ham10000"),
) -> Dict:
    """Process multiple images at once."""
    if model not in MODEL_PATHS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model. Available: {list(MODEL_PATHS.keys())}",
        )

    results = []

    for file in files:
        try:
            image = await read_upload(file)
            with MODEL_LOCK:
                loaded_model = load_model(model)
                processed_image = preprocess_image(image, model_name=model)
                predictions = loaded_model.predict(processed_image, verbose=0)

            classification, confidence, result_type = get_prediction_summary(
                model, predictions
            )

            classes_dict = MODEL_CLASSES[model]
            detailed_predictions = {
                classes_dict[i]: float(predictions[0][i])
                for i in range(len(predictions[0]))
            }

            results.append(
                {
                    "filename": file.filename,
                    "classification": classification,
                    "confidence": confidence,
                    "result_type": result_type,
                    "detailed_predictions": detailed_predictions,
                }
            )

        except Exception:
            results.append(
                {
                    "filename": file.filename,
                    "error": "Error processing image.",
                }
            )

    return {
        "status": "success",
        "model": model,
        "total_images": len(files),
        "results": results,
        "warning": "These predictions should not be used for medical diagnosis. Consult a dermatologist for professional evaluation.",
    }


@app.get("/{requested_path:path}", include_in_schema=False)
async def serve_frontend(requested_path: str):
    """Serve the React production build after API routes have been matched."""
    index_file = FRONTEND_BUILD_DIR / "index.html"
    requested_file = (FRONTEND_BUILD_DIR / requested_path).resolve()

    if (
        requested_path
        and requested_file.is_relative_to(FRONTEND_BUILD_DIR.resolve())
        and requested_file.is_file()
    ):
        return FileResponse(requested_file)

    if index_file.is_file():
        return FileResponse(index_file)

    raise HTTPException(status_code=404, detail="Frontend build is unavailable.")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
