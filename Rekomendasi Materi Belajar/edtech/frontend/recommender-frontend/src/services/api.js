const API_BASE_URL = 'http://localhost:8025';

export const getRecommendations = async (userId, userHistory = [], algorithm = 'hybrid') => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        user_history: userHistory,
        n_recommendations: 5,
        algorithm: algorithm
      }),
    });

    const contentType = response.headers.get('content-type');
    
    // Jika response bukan JSON, handle error
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Response bukan JSON: ${text.substring(0, 100)}`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Gagal mendapatkan rekomendasi');
    }

    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return {
      success: false,
      message: error.message.includes('JSON') ? 
               'Terjadi kesalahan pada server. Coba lagi nanti.' : 
               error.message,
      recommendations: []
    };
  }
};