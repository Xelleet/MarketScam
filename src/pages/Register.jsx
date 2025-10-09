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
  const[buyerProfileData, setBuyerProfileData] = useState({
    type: 'buyer',
    address: '',
    delivery_preferences: '',
  })

  const[sellerProfileData, setSellerProfileData] = useState({
    type: 'seller',
    company_name: '',
    description: '',
  })
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

  const handleBuyerChange = (e) => {
    setBuyerProfileData({
      ...buyerProfileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSellerChange = (e) => {
    setSellerProfileData({
      ...sellerProfileData,
      [e.target.name]: e.target.value,
    })
  }

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();  // Отменяем перезагрузку страницы

    try {
      localStorage.remove('token')
      // Делаем запрос к API для регистрации

      const loginForm = {
        username: formData.username, 
        password: formData.password,
      }
      await authAPI.register(formData);

      const response = await authAPI.login(loginForm);
      const token = response.data.token;
      setAuthToken(token);

      if (formData.user_type == 'buyer'){
        await authAPI.registerProfile(buyerProfileData, token)
      }
      else{
        await authAPI.registerProfile(sellerProfileData, token)
      }
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации');
      console.log(err);
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

        {formData.user_type === 'buyer' &&(
          <div>
            <input
              type='text'
              name='address'
              placeholder='Адрес'
              value={buyerProfileData.address}
              onChange={handleBuyerChange}
              style={styles.input}
            ></input>
            <input
              type='text'
              name='delivery_prerefences'
              placeholder='Предпочтения в достаке'
              value={buyerProfileData.delivery_prerefences}
              onChange={handleBuyerChange}
              style={styles.input}
            ></input>
           </div> 
        )}

        {/*Будь у меня фронтер, я бы забубенил тут стили, но мне чота как-то не хочется */}
        {formData.user_type === 'seller' &&(
          <div>
            <input
              type='text'
              name='companyName'
              placeholder='Название компании'
              value={sellerProfileData.company_name}
              onChange={handleSellerChange}
              style={styles.input}
              required
            ></input>
            <textarea
              type='text'
              name='Description'
              placeholder='Расскажите о себе :-)'
              value={sellerProfileData.description}
              onChange={handleSellerChange}
            ></textarea>
           </div>
        )}

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