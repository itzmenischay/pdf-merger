import React, { useState } from 'react';
import '../styles/Preview.css';

const Preview = ({ mergedPdfUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="preview-container">
      <button 
        className="preview-button" 
        onClick={() => setShowPreview(!showPreview)}
        disabled={!mergedPdfUrl}
      >
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>
      
      {showPreview && mergedPdfUrl && (
        <div className="preview-content">
          <iframe 
            src={mergedPdfUrl} 
            className="preview-iframe"
            title="PDF Preview"
          />
        </div>
      )}
    </div>
  );
};

export default Preview;