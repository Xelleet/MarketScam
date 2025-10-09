import React, {useEffect, useState} from "react";
import { authAPI } from "../services/api";

export default function ProductsListPage(){
    const[products, setProducts] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async() => {
            try{
                const response = await authAPI.getProducts();
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
      <h2 style={styles.title}>Наши товары</h2>
      <div style={styles.productsGrid}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productPrice}>{product.price} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  productCardHover: {
    transform: 'scale(1.02)',
  },
  productName: {
    fontSize: '18px',
    marginBottom: '8px',
    color: '#222',
  },
  productPrice: {
    fontSize: '16px',
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#555',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: '#e74c3c',
  },
  errorText: {
    fontSize: '18px',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#777',
  },
};