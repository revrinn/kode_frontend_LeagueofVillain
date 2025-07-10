// Fungsi untuk memvalidasi user ID
export const validateUserId = (userId) => {
  if (!userId) return 'User ID tidak boleh kosong';
  if (userId.length < 3) return 'User ID terlalu pendek';
  if (userId.length > 20) return 'User ID terlalu panjang';
  return '';
};

// Fungsi untuk memformat data rekomendasi dari backend
export const formatRecommendations = (data) => {
  if (!data || !data.recommendations) return [];
  
  return data.recommendations.map(rec => ({
    material_id: rec.material_id,
    score: rec.score,
    confidence: rec.confidence || Math.min(Math.round(rec.score * 100), 99)
  }));
};

// Fungsi untuk menangani error dari API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.message || 'Terjadi kesalahan saat memproses permintaan'
  };
};