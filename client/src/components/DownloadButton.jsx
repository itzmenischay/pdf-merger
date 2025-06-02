import React from 'react';
import '../styles/DownloadButton.css';

const DownloadButton = ({ mergedPdfUrl }) => {
  const handleDownload = () => {
    if (!mergedPdfUrl) return;

    const a = document.createElement('a');
    a.href = mergedPdfUrl;
    a.download = 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Delay revoking to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(mergedPdfUrl);
    }, 2000);
  };

  return (
    <button 
      className="download-button" 
      onClick={handleDownload}
      disabled={!mergedPdfUrl}
    >
      Download Merged PDF
    </button>
  );
};

export default DownloadButton;
