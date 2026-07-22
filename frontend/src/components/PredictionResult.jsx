import React from 'react';
import './PredictionResult.css';

function PredictionResult({ prediction, onReset }) {
  const isMalignant = prediction.classification.includes('Malignant');
  const confidencePercent = (prediction.confidence * 100).toFixed(0);

  const detailedPredictions = Object.entries(prediction.detailed_predictions || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="prediction-result">
      <div className={`result-card ${isMalignant ? 'malignant' : 'benign'}`}>
        <div className="result-header">
          <div className="classification-display">
            <span className={`badge ${isMalignant ? 'malignant' : 'benign'}`}>
              {prediction.classification}
            </span>
          </div>
          <div className="confidence-display">
            <div className="confidence-label">Confidence</div>
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
          <p>This analysis is for clinical reference. Always consult a dermatologist.</p>
        </div>

        <button className="action-button" onClick={onReset}>
          Analyze another image
        </button>
      </div>
    </div>
  );
}

export default PredictionResult;
