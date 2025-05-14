import React, { useState, useEffect, useRef } from 'react';
import './MarkerModal.css';

export const MarkerModal = ({ onClose, onSave, marker }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (marker) {
      setTitle(marker.title || '');
      setDescription(marker.description || '');
      setImage(marker.image || null);
    } else {
      setTitle('');
      setDescription('');
      setImage(null);
    }
  }, [marker]);

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
    onSave({ id: marker?.id, title, description, image, position: marker?.position });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal scrollable-modal">
        <h2>{marker ? 'Редактировать метку' : 'Создать новую метку'}</h2>

        <input
          type="text"
          value={title}
          placeholder="Название"
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          value={description}
          placeholder="Описание"
          onChange={e => setDescription(e.target.value)}
        />

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          Перетащите изображение сюда или нажмите, чтобы выбрать
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {image && <img src={image} alt="preview" className="preview" />}

        <div className="actions">
          <button onClick={onClose}>Отмена</button>
          <button onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};
