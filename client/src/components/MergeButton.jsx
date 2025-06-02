import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MergeButton.css';

const MergeButton = ({ files, onMergeComplete, onMergeError }) => {
  const [isMerging, setIsMerging] = useState(false);

  const handleMerge = async () => {
    if (!files || files.length < 2) {
      console.warn('Not enough files to merge');
      return;
    }

    setIsMerging(true);

    try {
      const formData = new FormData();

      // Ensure files are File objects (sometimes drag-drop or other sources may give weird objects)
      files.forEach((file, index) => {
        if (file instanceof File) {
          formData.append('pdfs', file);
        } else {
          console.warn(`File at index ${index} is not a File object:`, file);
        }
      });

      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      const response = await axios.post(`${baseURL}/api/merge`, formData, {
        // Do NOT set Content-Type here — Axios sets it automatically with boundary
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      onMergeComplete(pdfUrl);
    } catch (err) {
      console.error('Merge error details:', {
        message: err.message,
        response: err.response ? err.response.data : 'No response',
        config: err.config,
      });
      onMergeError(err.response?.data?.error || 'Failed to merge PDFs. Please check the files and try again.');
      onMergeComplete(null); // Clear previous success URL on failure
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <button
      className={`merge-button ${isMerging ? 'merging' : ''}`}
      onClick={handleMerge}
      disabled={isMerging || !files || files.length < 2}
    >
      {isMerging ? 'Merging...' : `Merge ${files?.length || 0} PDFs`}
    </button>
  );
};

export default MergeButton;
