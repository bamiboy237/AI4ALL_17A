import React from 'react';
import './ModelSelector.css';

function ModelSelector({ selectedModel, onModelChange, availableModels }) {
  if (!availableModels) {
    return <div className="model-selector skeleton" />;
  }

  const models = availableModels.models || {};

  return (
    <div className="model-selector">
      <label className="model-label">Model</label>
      <div className="segmented-control">
        {Object.entries(models).map(([key, model]) => (
          <button
            key={key}
            className={`segment ${selectedModel === key ? 'active' : ''}`}
            onClick={() => onModelChange(key)}
          >
            <span className="segment-name">{model.name}</span>
            <span className="segment-hint">{key === 'ham10000' ? '7 classes' : '2 classes'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
