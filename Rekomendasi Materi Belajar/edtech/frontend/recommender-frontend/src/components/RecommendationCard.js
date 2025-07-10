import React from 'react';
import '../assets/styles/RecommendationCard.css';

const RecommendationCard = ({ material, rank }) => {
  const confidencePercentage = Math.round(material.score * 100);
  
  return (
    <div className="recommendation-card">
      <div className="rank-badge">#{rank}</div>
      <div className="card-content">
        <h3 className="material-title">Materi {material.material_id}</h3>
        <div className="confidence-meter">
          <div className="confidence-label">Kecocokan:</div>
          <div className="confidence-bar-container">
            <div 
              className="confidence-bar" 
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <div className="confidence-value">{confidencePercentage}%</div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;