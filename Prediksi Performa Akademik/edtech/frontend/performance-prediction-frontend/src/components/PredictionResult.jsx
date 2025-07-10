import React from 'react';
import './PredictionResult.css';

const PredictionResult = ({ prediction, confidenceInterval, featureContributions }) => {
  return (
    <div className="prediction-result">
      <h3>Prediction Results</h3>
      
      <div className="prediction-score">
        <div className="score-value">
          {prediction !== null ? prediction.toFixed(2) : '--'}
          <span>/10</span>
        </div>
        <div className="confidence-interval">
          Confidence interval: {confidenceInterval?.[0]?.toFixed(2) || '--'} - {confidenceInterval?.[1]?.toFixed(2) || '--'}
        </div>
      </div>

      {featureContributions && (
        <div className="feature-contributions">
          <h4>Key Influencing Factors:</h4>
          <ul>
            {featureContributions.slice(0, 5).map((feature, index) => (
              <li key={index}>
                <span className="feature-name">{feature.feature}</span>
                <span className="feature-impact">
                  {feature.contribution > 0 ? '+' : ''}{feature.contribution.toFixed(3)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;