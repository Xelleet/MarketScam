// src/pages/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';
import { authAPI } from '../services/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchOrderAndProfile = async () => {
      try {
        const [orderResponse, profileResponse] = await Promise.all([
          ordersAPI.getOrder(id),
          authAPI.getProfile(), // ← Получаем профиль текущего пользователя
        ]);

        setOrder(orderResponse.data);
        setNewStatus(orderResponse.data.status);
        setCurrentUserId(profileResponse.data.id); // ← Сохраняем ID текущего пользователя
      } catch (err) {
        setError('Ошибка загрузки заказа или профиля');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndProfile();
  }, [id, navigate]);

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    setNewStatus(status);

    try {
      await ordersAPI.updateOrder(id, { status });
      setOrder(prev => ({ ...prev, status }));
    } catch (err) {
      setError('Ошибка обновления статуса');
      console.error(err);
    }
  };

  if (loading) return <div>Загрузка заказа...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!order || !currentUserId) return <div>Заказ или профиль не найден</div>;

  // Определяем, является ли текущий пользователь продавцом
  const isSeller = order.seller === currentUserId;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Назад
      </button>

      <div style={styles.orderDetail}>
        <h1>Заказ #{order.id}</h1>

        <div style={styles.orderInfo}>
          <div style={styles.infoRow}>
            <strong>Сумма:</strong> {order.total_amount} ₽
          </div>
          <div style={styles.infoRow}>
            <strong>Дата создания:</strong> {new Date(order.created_at).toLocaleString()}
          </div>
          <div style={styles.infoRow}>
            <strong>Статус:</strong>
            {/* Отображаем селектор статуса только если пользователь - продавец */}
            {isSeller ? (
              <select
                value={newStatus}
                onChange={handleStatusChange}
                style={styles.statusSelect}
              >
                <option value="pending">В обработке</option>
                <option value="confirmed">Подтверждено</option>
                <option value="shipped">Отправлено</option>
                <option value="delivered">Доставлено</option>
                <option value="cancelled">Отменено</option>
              </select>
            ) : (
              // Если не продавец, просто отображаем текущий статус
              <span>{getStatusText(order.status)}</span>
            )}
          </div>
          <div style={styles.infoRow}>
            <strong>Адрес доставки:</strong> {order.shipping_address}
          </div>
          <div style={styles.infoRow}>
            <strong>Покупатель:</strong> {order.buyer_name}
          </div>
          <div style={styles.infoRow}>
            <strong>Продавец:</strong> {order.seller_name}
          </div>
        </div>

        <div style={styles.itemsSection}>
          <h3>Товары в заказе:</h3>
          {order.items && order.items.map(item => (
            <div key={item.id} style={styles.itemRow}>
              <div style={styles.itemInfo}>
                <p>{item.product_details?.name || 'Товар'}</p>
                <p>Цена: {item.price} ₽</p>
                <p>Количество: {item.quantity} шт.</p>
                <p><strong>Итого: {item.get_total} ₽</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Вспомогательные функции
const getStatusText = (status) => {
  const statusMap = {
    pending: 'В обработке',
    confirmed: 'Подтверждено',
    shipped: 'Отправлено',
    delivered: 'Доставлено',
    cancelled: 'Отменено',
  };
  return statusMap[status] || status;
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  backButton: {
    marginBottom: '20px',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  orderDetail: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
  },
  orderInfo: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '4px',
  },
  infoRow: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  statusSelect: {
    marginLeft: '10px',
    padding: '4px 8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  itemsSection: {
    marginTop: '20px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  itemInfo: {
    flex: 1,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '50px',
  },
};