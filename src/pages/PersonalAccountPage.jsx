import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { isAuthenticated, removeAuthToken } from '../utils/auth';

export default function PersonAccountPage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        let response = await authAPI.getProfile();
        setUser(response.data);

        if (response.data.user_type == 'seller'){
            response = await authAPI.updateSellerProfile();
            setProfileData(response.data);
        }
        else if (response.data.user_type == 'buyer'){
            response = await authAPI.updateBuyerProfile();
            setProfileData(response.data);
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        if (err.response && err.response.status === 401) {
          removeAuthToken();
          navigate('/login');
        } else {
          setError('Ошибка загрузки профиля');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div>Загрузка профиля...</div>;
  if (error) {
    return (
      <div style={styles.error}>
        {error}
        <br />
        <button onClick={() => navigate('/login')} style={styles.errorButton}>
          Перейти на страницу входа
        </button>
      </div>
    );
  }

  if (!user) return <div>Пользователь не найден</div>;

  return (
    <div style={styles.container}>
      <h1>Личный кабинет</h1>

      <div style={styles.profileSection}>
        <h2>Информация о пользователе</h2>
        <div style={styles.infoRow}>
          <strong>Имя пользователя:</strong> {user.username}
        </div>
        <div style={styles.infoRow}>
          <strong>Email:</strong> {user.email}
        </div>
        <div style={styles.infoRow}>
          <strong>Тип пользователя:</strong> {user.user_type === 'seller' ? 'Продавец' : 'Покупатель'}
        </div>
        <div style={styles.infoRow}>
          <strong>Телефон:</strong> {user.phone || 'Не указан'}
        </div>
      </div>

      {/* Отображаем профиль продавца, если пользователь - продавец */}
      {user.user_type === 'seller' && user.seller_profile && (
        <div style={styles.profileSection}>
          <h2>Профиль продавца</h2>
          <div style={styles.infoRow}>
            <strong>Название компании:</strong> {user.seller_profile.company_name || 'Не указано'}
          </div>
          <div style={styles.infoRow}>
            <strong>Описание:</strong> {user.seller_profile.description || 'Нет описания'}
          </div>
          <div style={styles.infoRow}>
            <strong>Рейтинг:</strong> {user.seller_profile.rating || '0.00'}
          </div>
          <div style={styles.infoRow}>
            <strong>Верифицирован:</strong> {user.seller_profile.is_verified ? 'Да' : 'Нет'}
          </div>
        </div>
      )}

      {/* Отображаем профиль покупателя, если пользователь - покупатель */}
      {user.user_type === 'buyer' && profileData && (
        <div style={styles.profileSection}>
          <h2>Профиль покупателя</h2>
          <div style={styles.infoRow}>
            <strong>Адрес доставки:</strong> {profileData.address || 'Не указан'}
          </div>
          <div style={styles.infoRow}>
            <strong>Предпочтения доставки:</strong> {profileData.delivery_preferences || 'Нет предпочтений'}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  profileSection: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  infoRow: {
    marginBottom: '10px',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '50px',
  },
  errorButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};