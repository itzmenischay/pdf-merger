import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import MergeButton from './components/MergeButton';
import DownloadButton from './components/DownloadButton';
import Preview from './components/Preview';

function App() {
  const [files, setFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFilesChange = (selectedFiles) => {
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    setFiles(pdfFiles);
    setMergedPdfUrl(null);
    setError(null);
  };

  const handleMergeComplete = (url) => {
    setMergedPdfUrl(url);
    setError(null);
  };

  const handleMergeError = (error) => {
    setError(error);
    setMergedPdfUrl(null);
  };

  // Clear uploads folder on page load
  useEffect(() => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    axios.post(`${baseURL}/api/clear-uploads`)
      .then(res => {
        console.log(res.data.message);
      })
      .catch(err => {
        console.error('Failed to clear uploads folder:', err);
      });
  }, []);

  return (
    <div className="App">
      <Header />
      <FileUpload onFilesChange={handleFilesChange} />
      {error && <div className="error-message">{error}</div>}
      <div className="action-section">
        <MergeButton 
          files={files} 
          onMergeComplete={handleMergeComplete}
          onMergeError={handleMergeError}
        />
        <Preview mergedPdfUrl={mergedPdfUrl} />
      </div>
      {mergedPdfUrl && <DownloadButton mergedPdfUrl={mergedPdfUrl} />}
    </div>
  );
}

export default App;
