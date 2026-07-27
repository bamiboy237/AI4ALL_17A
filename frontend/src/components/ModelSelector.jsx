import React from "react";
import "./ModelSelector.css";

function ModelSelector({
  selectedModel,
  onModelChange,
  availableModels,
  error,
  onRetry,
}) {
  if (error) {
    return (
      <div className="model-selector model-selector-error" role="alert">
        <span>{error}</span>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!availableModels) {
    return (
      <div
        className="model-selector skeleton"
        aria-label="Loading model options"
        role="status"
      />
    );
  }

  const models = availableModels.models || {};

  return (
    <div className="model-selector">
      <label className="model-label">Model</label>
      <div className="segmented-control">
        {Object.entries(models).map(([key, model]) => (
          <button
            key={key}
            className={`segment ${selectedModel === key ? "active" : ""}`}
            onClick={() => onModelChange(key)}
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
