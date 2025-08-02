import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaEye } from 'react-icons/fa';
import './ImageUpload.css';

const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            name: file.name
          });
          
          if (newImages.length === files.length) {
            const updatedImages = [...images, ...newImages].slice(0, maxImages);
            onImagesChange(updatedImages);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <div className="image-upload-header">
        <h4>Images du produit</h4>
        <span className="image-count">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Zone de drop */}
      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''} ${images.length >= maxImages ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={images.length < maxImages ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        {images.length === 0 ? (
          <div className="drop-zone-content">
            <FaUpload className="upload-icon" />
            <p>Glissez-déposez vos images ici ou cliquez pour sélectionner</p>
            <span className="file-types">JPG, PNG, GIF jusqu'à 5MB</span>
          </div>
        ) : (
          <div className="drop-zone-content">
            <FaUpload className="upload-icon" />
            <p>Ajouter plus d'images</p>
          </div>
        )}
      </div>

             {/* Prévisualisation des images */}
       {images.length > 0 && (
         <div className="images-preview">
           {images.map((image, index) => {
             // S'assurer que l'image a toutes les propriétés nécessaires
             const safeImage = {
               id: image.id || `image-${index}`,
               preview: image.preview || image.url || '',
               name: image.name || `Image ${index + 1}`,
               file: image.file || null,
               isExisting: image.isExisting || false
             };
             
             return (
               <div key={safeImage.id} className="image-preview-item">
                 <img 
                   src={safeImage.preview} 
                   alt={`Produit ${index + 1}`}
                   className="preview-image"
                 />
                             <div className="image-overlay">
                 <button
                   type="button"
                   className="btn-remove-image"
                   onClick={() => removeImage(safeImage.id)}
                   title="Supprimer l'image"
                 >
                   <FaTimes />
                 </button>
                 <button
                   type="button"
                   className="btn-view-image"
                   onClick={() => window.open(safeImage.preview, '_blank')}
                   title="Voir l'image"
                 >
                   <FaEye />
                 </button>
               </div>
               <div className="image-info">
                 <span className="image-name">{safeImage.name}</span>
                 {safeImage.file && (
                   <span className="image-size">
                     {(safeImage.file.size / 1024 / 1024).toFixed(2)} MB
                   </span>
                 )}
               </div>
             </div>
           );
         })}
         </div>
       )}

      {/* Message d'aide */}
      <div className="upload-help">
        <p>💡 <strong>Conseils :</strong></p>
        <ul>
          <li>Utilisez des images de haute qualité (minimum 800x600px)</li>
          <li>Formats acceptés : JPG, PNG, GIF</li>
          <li>Taille maximale : 5MB par image</li>
          <li>La première image sera l'image principale du produit</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload; 