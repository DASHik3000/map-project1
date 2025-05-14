import React, { useState } from 'react';
import { Marker } from '@react-google-maps/api';

export const DraggableIcon = ({ position, onPositionChange }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setDragging(false);
    onPositionChange(newPosition); // Передаем новые координаты
  };

  return (
    <Marker
      position={position}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      icon={{
        url: '/Marker.svg', // Путь к твоей иконке
        scaledSize: new window.google.maps.Size(40, 40), // Размер иконки
      }}
    />
  );
};
