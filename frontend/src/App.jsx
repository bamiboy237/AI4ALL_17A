import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import ImageUpload from './components/ImageUpload';
import PredictionResult from './components/PredictionResult';
import ModelSelector from './components/ModelSelector';
import About from './pages/About';
import Sources from './pages/Sources';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedModel, setSelectedModel] = useState('ham10000');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [availableModels, setAvailableModels] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${API_URL}/models`);
        setAvailableModels(response.data);
      } catch (err) {
        console.error('Failed to fetch models:', err);
      }
    };
    fetchModels();
  }, []);

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', selectedModel);

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Unable to process image. Please try again.';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'home' && (
        <>
          <main className="main-content">
            <div className="container">
              <header className="header">
                <h1>Skin Lesion Classifier</h1>
                <p className="subtitle">Clinical reference tool</p>
              </header>

              <div className="workspace">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  availableModels={availableModels}
                />

                <ImageUpload
                  onImageUpload={handleImageUpload}
                  loading={loading}
                  disabled={!availableModels}
                />

                {uploadedImage && !loading && (
                  <div className="image-preview">
                    <img src={uploadedImage} alt="Uploaded lesion" />
                  </div>
                )}

                {loading && (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Analyzing image</p>
                  </div>
                )}

                {error && (
                  <div className="error-state">
                    <p className="error-message">{error}</p>
                    <button className="retry-button" onClick={() => window.location.reload()}>
                      Retry
                    </button>
                  </div>
                )}

                {prediction && !loading && (
                  <PredictionResult
                    prediction={prediction}
                    onReset={handleReset}
                  />
                )}
              </div>
            </div>
          </main>

          <footer className="footer">
            <div className="container">
              <p>
                This tool is for clinical reference and research only.
                Always consult a dermatologist for diagnosis.
              </p>
            </div>
          </footer>
        </>
      )}

      {currentPage === 'about' && <About />}
      {currentPage === 'sources' && <Sources />}
    </div>
  );
}

export default App;
