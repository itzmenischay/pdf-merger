import React, { useState, useCallback } from 'react';
import '../styles/FileUpload.css';

const FileUpload = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Filter PDFs and update state + notify parent
  const updateFiles = useCallback((fileList) => {
    const pdfFiles = Array.from(fileList).filter(file => file.type === 'application/pdf');
    setFiles(pdfFiles);
    onFilesChange(pdfFiles);
  }, [onFilesChange]);

  const handleFileChange = (e) => {
    updateFiles(e.target.files);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    updateFiles(e.dataTransfer.files);
  }, [updateFiles]);

  return (
    <div 
      className={`file-upload ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="pdf-upload"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="pdf-upload">
        {files.length > 0 ? (
          `${files.length} PDF file(s) selected`
        ) : (
          <>
            <span>Drag & Drop PDF files here or</span>
            <span className="browse-text">Browse files</span>
          </>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
