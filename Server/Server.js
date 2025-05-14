const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Для парсинга JSON в теле запроса

let markers = []; // Храним метки просто в памяти

// Мок-данные пользователей
const mockUsers = {
  'user1@example.com': { name: 'User One', email: 'user1@example.com' },
  'user2@example.com': { name: 'User Two', email: 'user2@example.com' },
};

// Проверка JWT-токена
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <токен>"
  if (!token) return res.status(403).send('Token required');

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = decoded;
    next();
  });
};

// Получить все метки (доступно всем)
app.get('/api/markers', (req, res) => {
  res.json(markers);
});

// Добавить новую метку (только для авторизованных)
app.post('/api/markers', verifyToken, (req, res) => {
  const { lat, lng, title } = req.body;

  const newMarker = {
    id: markers.length + 1,
    lat,
    lng,
    title,
    email: req.user.email,
  };

  markers.push(newMarker);
  res.status(201).json(newMarker);
});

// Обновить метку (только автор может редактировать)
app.put('/api/markers/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const marker = markers.find(m => m.id === parseInt(id));

  if (!marker) return res.status(404).send('Marker not found');
  if (marker.email !== req.user.email) return res.status(403).send('You can only update your own markers');

  marker.title = title;
  res.json(marker);
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
