import React, { useState } from 'react';
import '../styles/Preview.css';

const Preview = ({ mergedPdfUrl }) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  return (
    <div className="preview-container">
      <button 
        className="preview-button" 
        onClick={() => setShowModal(true)}
        disabled={!mergedPdfUrl}
      >
        Show Preview
      </button>

      {showModal && mergedPdfUrl && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <iframe 
              src={mergedPdfUrl}
              className="preview-iframe"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
