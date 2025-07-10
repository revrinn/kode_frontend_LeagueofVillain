document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('learningForm');
    const resultContainer = document.getElementById('resultContainer');
    const predictionResult = document.getElementById('predictionResult');
    const clusterDescription = document.getElementById('clusterDescription');
    const inputDetails = document.getElementById('inputDetails');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset state
        errorMessage.classList.add('hidden');
        resultContainer.classList.add('hidden');
        
        // Ambil data dari form
        const inputData = {
            engagement_score: parseFloat(document.getElementById('engagement_score').value),
            duration_minutes: parseFloat(document.getElementById('duration_minutes').value),
            completion_rate: parseFloat(document.getElementById('completion_rate').value),
            quiz_score: parseFloat(document.getElementById('quiz_score').value),
            material_rating: parseFloat(document.getElementById('material_rating').value),
            interaction_duration: parseFloat(document.getElementById('interaction_duration').value),
            material_engagement_score: parseFloat(document.getElementById('material_engagement_score').value)
        };

        try {
            // Coba endpoint utama dulu
            let response = await fetch('http://localhost:8001/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData)
            });
            
            // Jika endpoint utama gagal, coba endpoint alternatif
            if (!response.ok) {
                response = await fetch('http://localhost:8001/api/v1/predict/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputData)
                });
            }
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Request failed');
            }
            
            const result = await response.json();
            
            // Tampilkan hasil
            predictionResult.textContent = `Hasil: ${result.predicted_gaya_belajar}`;
            
            const clusterDescriptions = {
                "Visual": "Gaya Belajar Visual: Anda lebih mudah memahami informasi melalui gambar, diagram, dan visualisasi.",
                "Auditori": "Gaya Belajar Auditori: Anda lebih mudah memahami melalui pendengaran dan penjelasan lisan.",
                "Kinestetik": "Gaya Belajar Kinestetik: Anda lebih mudah memahami melalui praktik langsung dan pengalaman fisik."
            };
            
            clusterDescription.textContent = clusterDescriptions[result.predicted_gaya_belajar] || 
                                           `Cluster ${result.cluster}: Deskripsi gaya belajar tidak tersedia.`;
            
            // Tampilkan detail input
            inputDetails.innerHTML = '';
            for (const [key, value] of Object.entries(result.input_data)) {
                const li = document.createElement('li');
                li.textContent = `${key.replace(/_/g, ' ')}: ${value}`;
                inputDetails.appendChild(li);
            }
            
            // Tampilkan container hasil
            resultContainer.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.classList.remove('hidden');
        }
    });
});