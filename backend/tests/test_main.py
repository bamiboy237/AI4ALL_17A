from unittest.mock import Mock

import numpy as np
import pytest
from PIL import Image

from backend import main


def test_load_model_keeps_only_the_requested_model(monkeypatch, tmp_path):
    ham_path = tmp_path / "ham.keras"
    ddi_path = tmp_path / "ddi.keras"
    ham_path.touch()
    ddi_path.touch()

    monkeypatch.setattr(main, "MODEL_PATHS", {"ham10000": str(ham_path), "ddi": str(ddi_path)})
    load_model = Mock(side_effect=[Mock(input_shape=(None, 75, 100, 3)), Mock(input_shape=(None, 224, 224, 3))])
    monkeypatch.setattr(main.tf.keras.models, "load_model", load_model)
    monkeypatch.setattr(main.tf.keras.backend, "clear_session", Mock())
    main.models.clear()

    main.load_model("ham10000")
    main.load_model("ddi")

    assert list(main.models) == ["ddi"]
    assert load_model.call_count == 2


def test_preprocess_uses_the_loaded_models_input_shape():
    main.models.clear()
    main.models["ddi"] = Mock(input_shape=(None, 75, 100, 3))

    result = main.preprocess_image(
        Image.new("RGB", (50, 50), color=(100, 100, 100)),
        "ddi",
    )

    expected_value = (
        100 - main.STANDARDIZATION["ddi"][0]
    ) / main.STANDARDIZATION["ddi"][1]

    assert result.shape == (1, 75, 100, 3)
    assert result.dtype == np.float32
    assert np.isclose(result[0, 0, 0, 0], expected_value)


def test_efficientnet_receives_raw_pixel_values():
    main.models.clear()
    main.models["ham10000_b0"] = Mock(input_shape=(None, 224, 224, 3))

    result = main.preprocess_image(
        Image.new("RGB", (50, 50), color=(100, 100, 100)),
        "ham10000_b0",
    )

    assert result.shape == (1, 224, 224, 3)
    assert result[0, 0, 0, 0] == 100


def test_ddi_prediction_uses_the_16_class_mapping():
    predictions = np.zeros((1, 16), dtype=np.float32)
    predictions[0, 11] = 0.7

    classification, confidence, result_type = main.get_prediction_summary(
        "ddi", predictions
    )

    assert classification == "Other or miscellaneous"
    assert np.isclose(confidence, 0.7)
    assert result_type == "neutral"


@pytest.mark.parametrize(
    ("class_index", "expected_classification", "expected_result_type"),
    [
        (1, "Malignant (Requires Medical Attention)", "malignant"),
        (4, "Benign", "benign"),
    ],
)
def test_ham10000_prediction_uses_the_training_class_order(
    class_index, expected_classification, expected_result_type
):
    predictions = np.zeros((1, 7), dtype=np.float32)
    predictions[0, class_index] = 0.8

    classification, confidence, result_type = main.get_prediction_summary(
        "ham10000", predictions
    )

    assert classification == expected_classification
    assert np.isclose(confidence, 0.8)
    assert result_type == expected_result_type


def test_prediction_rejects_a_label_count_mismatch():
    predictions = np.zeros((1, 15), dtype=np.float32)

    with pytest.raises(ValueError, match="15 scores for 16 labels"):
        main.get_prediction_summary("ddi", predictions)


def test_api_routes_are_namespaced_under_api():
    paths = {route.path for route in main.app.routes}

    assert "/api/health" in paths
    assert "/api/models" in paths
    assert "/api/predict" in paths


def test_available_models_include_ddi():
    assert "ddi" in main.MODEL_PATHS
    assert len(main.MODEL_CLASSES["ddi"]) == 16
