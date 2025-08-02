import React, { useState, useRef } from 'react';
import { FaCamera, FaTimes, FaEye } from 'react-icons/fa';
import './ProfileImageUpload.css';

const ProfileImageUpload = ({ currentImage, onImageChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="profile-image-upload">
      <div className="image-container">
        <img 
          src={currentImage?.preview || currentImage || "https://via.placeholder.com/200x200?text=Photo+de+profil"} 
          alt="Photo de profil" 
          className="profile-image"
        />
        
        {/* Overlay pour l'upload */}
        <div className="image-overlay">
          <div className="upload-actions">
            <button
              type="button"
              className="btn-upload"
              onClick={openFileDialog}
              title="Changer la photo"
            >
              <FaCamera />
            </button>
            
            {currentImage && (
              <>
                <button
                  type="button"
                  className="btn-view"
                  onClick={() => window.open(currentImage.preview || currentImage, '_blank')}
                  title="Voir l'image"
                >
                  <FaEye />
                </button>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={removeImage}
                  title="Supprimer l'image"
                >
                  <FaTimes />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Zone de drop */}
        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Informations sur l'image */}
      {currentImage && currentImage.file && (
        <div className="image-info">
          <span className="image-name">{currentImage.name}</span>
          <span className="image-size">
            {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}

      {/* Conseils */}
      <div className="upload-tips">
        <p>💡 <strong>Conseils :</strong></p>
        <ul>
          <li>Utilisez une photo de profil claire et professionnelle</li>
          <li>Formats acceptés : JPG, PNG, GIF</li>
          <li>Taille maximale : 5MB</li>
          <li>Dimensions recommandées : 400x400px</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileImageUpload; 