import React, { useState } from 'react';
import './MarkerSidebar.css';

export const MarkerSidebar = ({ marker, onClose, onRequestEdit, onRequestDelete, canEdit }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!marker) return null;

  return (
    <>
      <div className="sidebar">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{marker.title}</h2>

        {marker.image && (
          <div
            className="marker-img-container"
            onClick={() => setIsImageOpen(true)}
          >
            <img src={marker.image} alt="marker" className="marker-img" />
            <div className="img-overlay">🔍 Просмотр</div>
          </div>
        )}

        <p>{marker.description}</p>
        <p className="marker-owner"><strong>Создано:</strong> {marker.owner}</p>

        {canEdit && (
          <div className="sidebar-actions">
            <button onClick={() => onRequestEdit(marker)}>✏️ Редактировать</button>
            <button onClick={() => onRequestDelete(marker)}>🗑️ Удалить</button>
          </div>
        )}
      </div>

      {/* Модальное окно для полноэкранного изображения */}
      {isImageOpen && (
        <div className="fullscreen-img-backdrop" onClick={() => setIsImageOpen(false)}>
          <img src={marker.image} alt="fullscreen" className="fullscreen-img" />
        </div>
      )}
    </>
  );
};
