import React, {useEffect, useState} from "react";
import { authAPI } from "../services/api";
import { productsAPI } from "../services/api";
import { useNavigate } from 'react-router-dom';


export default function SellerProductsListPage(){
const[products, setProducts] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async() => {
            const response = await authAPI.getProfile();
                  if (response.data.user_type !== 'seller'){
                    navigate('/');
                  }
            try{
                const response = await productsAPI.getSellerProducts();
                setProducts(response.data);
            }
            catch (err){
                setError(err);
            }
            finally{
                setLoading(false);
            }
        }

        fetchProducts();
    }, [])

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Загрузка товаров...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>Товары не найдены</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ваши товары</h2>
      <div style={styles.productsGrid}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productPrice}>{product.price} ₽</p>
          </div>
        ))}
      </div>
      <button onClick={() => {navigate(-1)}}>Назад</button>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '24px',
    textAlign: 'center',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
    justifyContent: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '20px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
  },
  productCardHover: {
    // Эффект при наведении можно добавить через onMouseEnter/onMouseLeave,
    // но если хотите чисто CSS — лучше использовать className и CSS.
    // Здесь оставим базовый стиль без hover в инлайне.
  },
  productName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 12px 0',
    lineHeight: 1.4,
  },
  productPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2b6cb0',
    margin: '0',
  },
};