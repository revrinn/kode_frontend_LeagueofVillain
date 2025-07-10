import axios from 'axios';

const API_BASE_URL = 'http://192.168.56.1:8024';

export const predictPerformance = async (features) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      features: {
        engagement_score: parseFloat(features.engagement_score),
        duration_minutes: parseFloat(features.duration_minutes),
        completion_rate: parseFloat(features.completion_rate),
        material_rating: parseFloat(features.material_rating),
        jam_belajar: parseFloat(features.jam_belajar),
        interaksi_total: parseFloat(features.interaksi_total)
      }
    });

    return {
      prediction: response.data.prediction,
      confidence_interval: response.data.confidence_interval,
      feature_contributions: response.data.feature_contributions
    };
  } catch (error) {
    console.error('Error predicting performance:', error);
    
    let errorMessage = 'Failed to make prediction';
    if (error.response) {
      // Server responded with a status code outside 2xx
      errorMessage = error.response.data.detail || error.response.statusText;
    } else if (error.request) {
      // No response received
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

export const getModelInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/model/info`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model info:', error);
    throw error;
  }
};