import React, { useState } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRecommendations } from '../services/api';
import '../assets/styles/RecommendationPage.css';

const RecommendationPage = () => {
  const [userId, setUserId] = useState('');
  const [userHistory, setUserHistory] = useState([]); // Tambahkan state untuk user history
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [algorithm, setAlgorithm] = useState('hybrid');

  const handleGetRecommendations = async () => {
    if (!userId) {
      setError('Masukkan User ID terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Split user history by comma and trim whitespace
      const historyArray = userHistory.split(',').map(item => item.trim());
      
      const result = await getRecommendations(userId, historyArray, algorithm);
      
      if (result.success) {
        setRecommendations(result.recommendations);
      } else {
        setError(result.message || 'Gagal mendapatkan rekomendasi');
        
        // Jika error karena server, tampilkan rekomendasi dummy untuk testing
        if (result.message.includes('server')) {
          setRecommendations([
            { material_id: 'MAT001', score: 0.95, confidence: 95 },
            { material_id: 'MAT002', score: 0.85, confidence: 85 },
            { material_id: 'MAT003', score: 0.75, confidence: 75 },
          ]);
        }
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan backend berjalan.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="recommendation-page">
      <div className="input-section">
        <div className="input-group">
          <label htmlFor="userId">User ID:</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Masukkan ID pengguna"
          />
        </div>

        <div className="input-group">
          <label htmlFor="userHistory">Riwayat Materi (pisahkan dengan koma):</label>
          <input
            id="userHistory"
            type="text"
            value={userHistory.join(',')}
            onChange={(e) => setUserHistory(e.target.value.split(',').map(item => item.trim()))}
            placeholder="MAT001, MAT002, MAT003"
          />
        </div>

        <div className="input-group">
          <label>Algoritma:</label>
          <div className="algorithm-options">
            <label>
              <input
                type="radio"
                value="hybrid"
                checked={algorithm === 'hybrid'}
                onChange={() => setAlgorithm('hybrid')}
              />
              Hybrid
            </label>
            <label>
              <input
                type="radio"
                value="collaborative"
                checked={algorithm === 'collaborative'}
                onChange={() => setAlgorithm('collaborative')}
              />
              Collaborative
            </label>
            <label>
              <input
                type="radio"
                value="content"
                checked={algorithm === 'content'}
                onChange={() => setAlgorithm('content')}
              />
              Content-Based
            </label>
          </div>
        </div>

        <button
          onClick={handleGetRecommendations}
          disabled={isLoading}
          className="recommend-button"
        >
          {isLoading ? 'Memproses...' : 'Dapatkan Rekomendasi'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <LoadingSpinner />
      ) : recommendations.length > 0 ? (
        <div className="recommendations-container">
          <h2>Rekomendasi Untuk Anda</h2>
          <div className="materials-grid">
            {recommendations.map((material, index) => (
              <RecommendationCard
                key={index}
                material={material}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>Masukkan User ID dan klik tombol untuk mendapatkan rekomendasi materi pembelajaran</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
