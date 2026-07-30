import React from "react";
import "./ModelSelector.css";

function ModelSelector({ selectedModel, onModelChange, models }) {
  return (
    <div className="model-selector">
      <label className="model-label">Model</label>
      <div className="segmented-control">
        {Object.entries(models).map(([key, model]) => (
          <button
            type="button"
            key={key}
            className={`segment ${selectedModel === key ? "active" : ""}`}
            onClick={() => onModelChange(key)}
            aria-pressed={selectedModel === key}
          >
            <span className="segment-name">{model.name}</span>
            <span className="segment-hint">{model.classes} classes</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
