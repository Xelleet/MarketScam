import React, { useState } from 'react';
// Импортируем useNavigate для перенаправления
import { useNavigate } from 'react-router-dom';
// Импортируем API для регистрации
import { authAPI } from '../services/api';
// Импортируем функцию для сохранения токена
import { setAuthToken } from '../utils/auth';

// Компонент страницы регистрации
export default function Register() {
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 'buyer',  // По умолчанию покупатель
    phone: '',
  });
  // Состояние для ошибки
  const [error, setError] = useState('');
  // Функция для навигации
  const navigate = useNavigate();

  // Обработчик изменений в полях формы
  const handleChange = (e) => {
    setFormData({
      ...formData,                        // Сохраняем старые значения
      [e.target.name]: e.target.value,    // Обновляем поле по имени
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();  // Отменяем перезагрузку страницы

    try {
      localStorage.clear('token')
      // Делаем запрос к API для регистрации
      const response = await authAPI.register(formData);
      // Получаем токен из ответа
      const token = response.data.token;
      // Сохраняем токен
      setAuthToken(token);
      // Перенаправляем на главную
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Регистрация</h2>
        {error && <div style={styles.error}>{error}</div>}

        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {/* Выбор типа пользователя */}
        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="buyer">Покупатель</option>
          <option value="seller">Продавец</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '10px',
  },
};