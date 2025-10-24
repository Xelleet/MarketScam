import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, productsAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '', // ID категории
    image: null, // файл
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Проверяем тип пользователя
    React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const getUser = async() => {
      const response = await authAPI.getProfile();
      if (response.data.user_type !== 'seller'){
        navigate('/');
      }
    }
    getUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('category', formData.category);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await productsAPI.createProduct(formDataToSend);
      alert('Товар успешно создан!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Создать товар</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Название:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.field}>
          <label>Цена:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Количество:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Категория (ID):</label>
          <input
            type="number"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            min="1"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Изображение:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={styles.input}
/>
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Создание...' : 'Создать товар'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    minHeight: '100px',
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
    color: 'red',
    marginBottom: '10px',
  },
};