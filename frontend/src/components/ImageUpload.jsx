import React, { useRef } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, loading, disabled }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-active');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onImageUpload(files[0]);
    }
  };

  return (
    <div className="image-upload">
      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex="0"
        onKeyPress={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading || disabled}
          style={{ display: 'none' }}
        />

        <div className="upload-content">
          <span className="upload-icon">+</span>
          <span className="upload-text">Add image</span>
          <span className="upload-hint">Drag or click to select</span>
        </div>
      </div>

      <p className="helper-text">
        JPEG, PNG, GIF, or WebP. Clear, well-lit images work best.
      </p>
    </div>
  );
}

export default ImageUpload;
