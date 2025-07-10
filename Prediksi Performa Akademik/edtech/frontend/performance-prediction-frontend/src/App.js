import React, { useState } from 'react';
import FeatureInputForm from './components/FeatureInputForm';
import PredictionResult from './components/PredictionResult';
import LoadingSpinner from './components/LoadingSpinner';
import { predictPerformance } from './services/api';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [confidenceInterval, setConfidenceInterval] = useState(null);
  const [featureContributions, setFeatureContributions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await predictPerformance(formData);
      
      setPrediction(result.prediction);
      setConfidenceInterval(result.confidence_interval);
      
      if (result.feature_contributions) {
        // Format feature names for display
        const formattedContributions = result.feature_contributions[0].map(item => ({
          ...item,
          feature: formatFeatureName(item.feature)
        }));
        setFeatureContributions(formattedContributions);
      }
    } catch (err) {
      setError(err.message || 'Failed to make prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFeatureName = (name) => {
    const names = {
      'engagement_score': 'Engagement Score',
      'duration_minutes': 'Study Duration',
      'completion_rate': 'Completion Rate',
      'material_rating': 'Material Rating',
      'jam_belajar': 'Study Time',
      'interaksi_total': 'Total Interactions'
    };
    return names[name] || name;
  };

  return (
    <div className="app">
      <header>
        <h1>Academic Performance Prediction System</h1>
      </header>

      <main>
        <div className="content">
          <FeatureInputForm onSubmit={handlePredict} isLoading={isLoading} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <p>Please ensure:</p>
              <ul>
                <li>Backend server is running at http://192.168.56.1:8000</li>
                <li>You have network connectivity</li>
                <li>All required fields are filled correctly</li>
              </ul>
            </div>
          )}
          
          {prediction !== null && (
            <PredictionResult 
              prediction={prediction}
              confidenceInterval={confidenceInterval}
              featureContributions={featureContributions}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;