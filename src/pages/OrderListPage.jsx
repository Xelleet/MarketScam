import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getOrders();
        // Нормализуем данные: гарантируем, что каждый order.items — массив
        const normalizedOrders = (response.data || []).map(order => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
        }));
        setOrders(normalizedOrders);
      } catch (err) {
        setError('Ошибка загрузки заказов');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <div>Загрузка заказов...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1>Мои заказы</h1>
      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <div style={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <h3>Заказ #{order.id}</h3>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                  }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <div style={styles.orderInfo}>
                <p><strong>Сумма:</strong> {order.total_amount} ₽</p>
                <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Статус:</strong> {getStatusText(order.status)}</p>
                <p><strong>Адрес доставки:</strong> {order.shipping_address}</p>
              </div>
              <div style={styles.orderItems}>
                <h4>Товары:</h4>
                {order.items.map(item => (
                  <div key={item.id || Math.random()} style={styles.orderItem}>
                    <p>{item.product_details?.name || 'Товар'} x {item.quantity}</p>
                    <p>{item.price} ₽ за шт.</p>
                    <p><strong>Всего: {item.get_total} ₽</strong></p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                style={styles.viewButton}
              >
                Детали заказа
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Вспомогательные функции для отображения статуса
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

const getStatusColor = (status) => {
  const colorMap = {
    pending: '#ffc107',
    confirmed: '#28a745',
    shipped: '#17a2b8',
    delivered: '#20c997',
    cancelled: '#dc3545',
  };
  return colorMap[status] || '#6c757d';
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  orderInfo: {
    marginBottom: '15px',
  },
  orderItems: {
    marginBottom: '15px',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px solid #eee',
  },
  viewButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '50px',
  },
};