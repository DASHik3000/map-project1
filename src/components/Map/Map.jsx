import React, { useRef, useCallback, useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import s from './Map.module.css';
import { defaultTheme } from './Theme';
import { CurrenLocationMarker } from '../Markers';
import { MarkerModal } from './MarkerModal';
import { MarkerSidebar } from './MarkerSidebar';

const containerStyle = { width: '100%', height: '100%' };

const defaultOptions = {
  panControl: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: true,
  rotateControl: false,
  clickableIcons: true,
  keyboardShortcuts: false,
  scrollwheel: true,
  disableDoubleClickZoom: true,
  fullscreenControl: false,
  styles: defaultTheme,
};

export const Map = ({ center, user, isAdmin }) => {
  const mapRef = useRef();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('markers');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMarkers(parsed);
    }
  }, []);

  const handleMapClick = useCallback(event => {
    if (!user) return alert('Чтобы добавлять метки, войдите в аккаунт.');
    setClickedPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    setShowCreateModal(true);
  }, [user]);

  const handleSaveMarker = data => {
    const newMarker = {
      id: Date.now(),
      position: clickedPosition,
      title: data.title,
      description: data.description,
      image: data.image,
      owner: user.email,
    };
    const updated = [...markers, newMarker];
    setMarkers(updated);
    localStorage.setItem('markers', JSON.stringify(updated));
    setShowCreateModal(false);
  };

  const handleRequestEdit = marker => setEditingMarker(marker);

  const handleSaveEdit = data => {
    const updated = markers.map(m =>
      m.id === data.id ? { ...m, title: data.title, description: data.description, image: data.image } : m
    );
    setMarkers(updated);
    localStorage.setItem('markers', JSON.stringify(updated));
    setEditingMarker(null);
    setSelectedMarker(updated.find(m => m.id === data.id));
  };

  const handleDeleteMarker = markerToDelete => {
    if (!isAdmin && markerToDelete.owner !== user?.email) {
      return alert('У вас нет прав для удаления этой метки.');
    }
    if (!window.confirm('Вы действительно хотите удалить эту метку?')) return;
    const updated = markers.filter(m => m.id !== markerToDelete.id);
    setMarkers(updated);
    localStorage.setItem('markers', JSON.stringify(updated));
    setSelectedMarker(null);
  };

  const handleDeleteAllMarkers = () => {
    if (!window.confirm('Удалить ВСЕ метки? Это действие необратимо.')) return;
    setMarkers([]);
    localStorage.removeItem('markers');
  };

  return (
    <div className={s.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={map => (mapRef.current = map)}
        onUnmount={() => (mapRef.current = undefined)}
        onClick={handleMapClick}
        options={defaultOptions}
      >
        <CurrenLocationMarker position={center} />
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position} onClick={() => setSelectedMarker(marker)} />
        ))}
      </GoogleMap>

      {showCreateModal && (
        <MarkerModal marker={null} onClose={() => setShowCreateModal(false)} onSave={handleSaveMarker} />
      )}

      {editingMarker && (
        <MarkerModal marker={editingMarker} onClose={() => setEditingMarker(null)} onSave={handleSaveEdit} />
      )}

      <MarkerSidebar
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
        onRequestEdit={handleRequestEdit}
        onRequestDelete={handleDeleteMarker}
        canEdit={(user?.email === process.env.REACT_APP_ADMIN_EMAIL) || (user && selectedMarker?.owner === user.email)}
      />

      {isAdmin && (
        <button onClick={handleDeleteAllMarkers} className={s.adminDeleteAll}>
          🧹 Удалить все метки
        </button>
      )}
    </div>
  );
};