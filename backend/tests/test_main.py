from unittest.mock import Mock

import numpy as np
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
    main.models["ddi"] = Mock(input_shape=(None, 224, 224, 3))

    result = main.preprocess_image(Image.new("RGB", (50, 50)), "ddi")

    assert result.shape == (1, 224, 224, 3)
    assert result.dtype == np.float32


def test_api_routes_are_namespaced_under_api():
    paths = {route.path for route in main.app.routes}

    assert "/api/health" in paths
    assert "/api/models" in paths
    assert "/api/predict" in paths
