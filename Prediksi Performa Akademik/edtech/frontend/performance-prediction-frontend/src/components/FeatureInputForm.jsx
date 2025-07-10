import React, { useState } from 'react';
import './FeatureInputForm.css';

const FeatureInputForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    engagement_score: '',
    duration_minutes: '',
    completion_rate: '',
    material_rating: '',
    jam_belajar: '',
    interaksi_total: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="input-form">
      <h2>Academic Performance Prediction</h2>
      <p>Enter student learning activity data:</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Engagement Score (0-1)</label>
          <input
            type="number"
            name="engagement_score"
            min="0"
            max="1"
            step="0.01"
            value={formData.engagement_score}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Study Duration (minutes)</label>
          <input
            type="number"
            name="duration_minutes"
            min="0"
            step="1"
            value={formData.duration_minutes}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Completion Rate (0-1)</label>
          <input
            type="number"
            name="completion_rate"
            min="0"
            max="1"
            step="0.01"
            value={formData.completion_rate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Material Rating (1-5)</label>
          <input
            type="number"
            name="material_rating"
            min="1"
            max="5"
            step="0.1"
            value={formData.material_rating}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Study Time (0-24)</label>
          <input
            type="number"
            name="jam_belajar"
            min="0"
            max="24"
            step="0.5"
            value={formData.jam_belajar}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Interactions</label>
          <input
            type="number"
            name="interaksi_total"
            min="0"
            step="1"
            value={formData.interaksi_total}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Predict Performance'}
        </button>
      </form>
    </div>
  );
};

export default FeatureInputForm;