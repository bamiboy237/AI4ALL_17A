import React from 'react';
import './PredictionResult.css';

function PredictionResult({ prediction, onReset }) {
  const resultType = prediction.result_type || (
    prediction.classification.includes('Malignant') ? 'malignant' : 'benign'
  );
  const confidencePercent = (prediction.confidence * 100).toFixed(0);

  const detailedPredictions = Object.entries(prediction.detailed_predictions || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="prediction-result">
      <div className={`result-card ${resultType}`}>
        <div className="result-header">
          <div className="classification-display">
            <span className={`badge ${resultType}`}>
              {prediction.classification}
            </span>
          </div>
          <div className="confidence-display">
            <div className="confidence-label">Model score</div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
            <div className="confidence-percent">{confidencePercent}%</div>
          </div>
        </div>

        <div className="predictions-breakdown">
          <h3 className="breakdown-title">Predictions by class</h3>
          <div className="predictions-list">
            {detailedPredictions.map(([label, score]) => (
              <div key={label} className="prediction-item">
                <span className="prediction-label">{label}</span>
                <div className="prediction-bar">
                  <div
                    className="prediction-fill"
                    style={{ width: `${score * 100}%` }}
                  ></div>
                </div>
                <span className="prediction-score">{(score * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="note">
          <p>
            This result is a model output, not a diagnosis. Contact a qualified
            healthcare professional if you have a concern.
          </p>
        </div>

        <button className="action-button" onClick={onReset}>
          Analyze another image
        </button>
      </div>
    </div>
  );
}

export default PredictionResult;
