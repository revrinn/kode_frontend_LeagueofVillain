import React from 'react';
import RecommendationPage from './pages/RecommendationPage';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Sistem Rekomendasi Materi Pembelajaran</h1>
      </header>
      <main className="main-content">
        <RecommendationPage />
      </main>
      <footer className="footer">
        <p>© 2023 EdTech Recommendation System</p>
      </footer>
    </div>
  );
}

export default App;