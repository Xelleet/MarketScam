import React from 'react';
// Импортируем BrowserRouter для маршрутизации
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Импортируем страницы (их создадим дальше)
import Login from './pages/Login';
import Register from './pages/Register';

// Главный компонент приложения
function App() {
  return (
    // Оборачиваем всё приложение в Router для маршрутизации
    <Router>
      {/* Основной контейнер */}
      <div className="App">
        {/* Определяем маршруты */}
        <Routes>
          {/* Маршрут для страницы входа */}
          <Route path="/login" element={<Login />} />
          {/* Маршрут для страницы регистрации */}
          <Route path="/register" element={<Register />} />
          {/* Маршрут по умолчанию (временно) */}
          <Route path="/" element={<div>Главная страница</div>} />
        </Routes>
      </div>
    </Router>
  );
}

// Экспортируем компонент
export default App;