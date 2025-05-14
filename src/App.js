import React, { useState, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Map } from './components/Map';
import s from './App.module.css';
import { Autocomplete } from './components/Autocomplete';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const API_KEY = process.env.REACT_APP_API_KEY;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_API_TOKEN;
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const defaultCenter = { lat: 41.8919, lng: 12.5113 };
const libraries = ['places'];

const App = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries,
    language: 'ru',
    region: 'RU',
  });

  const onPlaceSelect = useCallback(coords => {
    setCenter(coords);
  }, []);

  const handleLoginSuccess = response => {
    const decoded = jwtDecode(response.credential);
    console.log('✅ Вошедший пользователь:', decoded);
    setUser(decoded);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(decoded));
  };

  const handleLoginFailure = () => console.log('Login Failed');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className={s.app}>
      <header className={s.header}>
        <div className={s.searchBox}>
          {isLoaded && <Autocomplete isloaded={isLoaded} onSelect={onPlaceSelect} />}
        </div>
        <div className={s.loginBox}>
          {!isAuthenticated ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              clientId={CLIENT_ID}
            />
          ) : (
            <div className={s.userInfo}>
              <img src={user.picture} alt="Avatar" className={s.userAvatar} />
              <span className={s.userName}>
                {user.name} {isAdmin && '(админ)'}
              </span>
              <button onClick={handleLogout} className={s.logoutBtn}>Выйти</button>
            </div>
          )}
        </div>
      </header>

      <main className={s.mapContainer}>
        {isLoaded ? (
          <Map center={center} user={user} isAdmin={isAdmin} />
        ) : (
          <h2>Загрузка карты...</h2>
        )}
      </main>
    </div>
  );
};

export default App;