import React from 'react';
import '../assets/styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Memuat rekomendasi...</p>
    </div>
  );
};

export default LoadingSpinner;