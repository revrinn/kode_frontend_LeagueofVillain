document.addEventListener('DOMContentLoaded', function() {
    class LearningRecommendationSystem {
        constructor() {
            this.backendUrl = 'http://localhost:8000';
            this.isBackendAvailable = false;
            this.logEntries = [];
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.checkBackendStatus();
            this.log('Sistem dimulai', 'info');
        }
        
        setupEventListeners() {
            document.getElementById('testConnection').addEventListener('click', () => this.testConnection());
            document.getElementById('recommendationForm').addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        async checkBackendStatus() {
            try {
                const response = await fetch(`${this.backendUrl}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (response.ok) {
                    this.isBackendAvailable = true;
                    this.updateStatus('Backend tersedia', 'online');
                    this.log('Backend terhubung dengan sukses', 'success');
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                this.isBackendAvailable = false;
                this.updateStatus('Backend tidak tersedia - Mode demo aktif', 'offline');
                this.log(`Error koneksi backend: ${error.message}`, 'error');
            }
        }
        
        async testConnection() {
            this.log('Menguji koneksi backend...', 'info');
            await this.checkBackendStatus();
            
            if (!this.isBackendAvailable) {
                this.showError('Koneksi Gagal', 
                    'Backend tidak dapat diakses. Kemungkinan penyebab:\n' +
                    '1. Server FastAPI belum dijalankan\n' +
                    '2. Port 8000 tidak tersedia\n' +
                    '3. Firewall memblokir koneksi\n\n' +
                    'Menjalankan mode demo...');
            }
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            this.hideMessages();
            this.showLoading();
            
            try {
                const formData = this.getFormData();
                this.log('Memproses data form...', 'info');
                
                let recommendation;
                if (this.isBackendAvailable) {
                    recommendation = await this.getRecommendationFromBackend(formData);
                } else {
                    recommendation = this.getRecommendationFromDemo(formData);
                }
                
                this.showResult(recommendation);
                this.log('Rekomendasi berhasil dihasilkan', 'success');
            } catch (error) {
                this.showError('Error Processing', error.message);
                this.log(`Error: ${error.message}`, 'error');
            } finally {
                this.hideLoading();
            }
        }
        
        getFormData() {
            const form = document.getElementById('recommendationForm');
            return {
                gender: form.gender.value,
                grade: parseInt(form.grade.value),
                tech_savvy: form.tech_savvy.value,
                subject: form.subject.value,
                material_type: form.material_type.value,
                student_feedback: form.student_feedback.value,
                achievement_status: form.achievement_status.value,
                learning_speed: form.learning_speed.value
            };
        }
        
        async getRecommendationFromBackend(formData) {
            try {
                const response = await fetch(`${this.backendUrl}/recommend`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `HTTP ${response.status}`);
                }
                
                const data = await response.json();
                return data.recommended_method;
            } catch (error) {
                throw new Error(`Backend error: ${error.message}`);
            }
        }
        
        getRecommendationFromDemo(formData) {
            // Algoritma rekomendasi sederhana untuk demo
            const rules = [
                {
                    conditions: { tech_savvy: 'High', material_type: 'Interactive Exercise' },
                    method: 'Interactive Learning dengan Gamifikasi'
                },
                {
                    conditions: { learning_speed: 'Fast', achievement_status: 'Pass' },
                    method: 'Accelerated Learning dengan Kustomisasi'
                },
                {
                    conditions: { material_type: 'Video Lesson', learning_speed: 'Slow' },
                    method: 'Video-Based Learning dengan Repetisi'
                },
                {
                    conditions: { student_feedback: 'Positive', tech_savvy: 'Medium' },
                    method: 'Blended Learning dengan Teknologi'
                },
                {
                    conditions: { achievement_status: 'Fail', learning_speed: 'Slow' },
                    method: 'Remedial Learning dengan Dukungan Tambahan'
                }
            ];
            
            // Cari rule yang cocok
            for (const rule of rules) {
                let match = true;
                for (const [key, value] of Object.entries(rule.conditions)) {
                    if (formData[key] !== value) {
                        match = false;
                        break;
                    }
                }
                if (match) return rule.method;
            }
            
            // Default fallback
            const defaultMethods = [
                'Blended Learning',
                'Visual Learning',
                'Collaborative Learning',
                'Self-Paced Learning',
                'Project-Based Learning'
            ];
            
            return defaultMethods[Math.floor(Math.random() * defaultMethods.length)];
        }
        
        updateStatus(message, status) {
            const statusIndicator = document.querySelector('.status-indicator');
            const statusText = document.getElementById('statusText');
            
            statusIndicator.className = `status-indicator status-${status}`;
            statusText.textContent = message;
        }
        
        showLoading() {
            document.getElementById('loadingIndicator').style.display = 'block';
            document.getElementById('submitBtn').disabled = true;
        }
        
        hideLoading() {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
        }
        
        showResult(method) {
            document.getElementById('recommendationResult').textContent = method;
            document.getElementById('resultContainer').style.display = 'block';
        }
        
        showError(title, message) {
            document.getElementById('errorMessage').textContent = message;
            document.getElementById('errorContainer').style.display = 'block';
        }
        
        hideMessages() {
            document.getElementById('errorContainer').style.display = 'none';
            document.getElementById('resultContainer').style.display = 'none';
        }
        
        log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}`;
            
            this.logEntries.push({ message: logEntry, type });
            this.updateLogDisplay();
        }
        
        updateLogDisplay() {
            const logContent = document.getElementById('logContent');
            logContent.innerHTML = this.logEntries.map(entry => 
                `<div class="log-entry log-${entry.type}">${entry.message}</div>`
            ).join('');
            logContent.scrollTop = logContent.scrollHeight;
        }
    }
    
    // Initialize the system
    new LearningRecommendationSystem();
});