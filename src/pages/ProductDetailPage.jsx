import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authAPI, productsAPI } from "../services/api";
import { isAuthenticated } from "../utils/auth";
import { ordersAPI } from "../services/api";

const styles = {
  // Стили для основного контейнера
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  // Стили для кнопки "Назад"
  backButton: {
    marginBottom: '20px',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  // Стили для контейнера деталей товара
  productDetail: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  // Стили для изображения товара
  productImage: {
    width: '400px',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  // Стили для контейнера информации о товаре
  productInfo: {
    flex: 1,
  },
  // Стили для описания товара
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  details: {
    marginBottom: '20px',
  },
  // Стили для секции заказа
  orderSection: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  // Стили для поля ввода количества
  quantityInput: {
    width: '60px',
    padding: '8px',
    marginLeft: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  // Стили для кнопки заказа
  orderButton: {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  // Стили для сообщения об ошибке заказа
  orderError: {
    // Цвет текста
    color: 'red',
    // Отступ сверху
    marginTop: '10px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '50px',
  },
};

export default function ProductDetailPage(){
    const[product, setProduct] = useState(null);
    const[loading, setLoading] = useState(true);
    const[errors, setErrors] = useState('');
    const[currentUserId, setCurrentUserId] =  useState(null);

    const[quantity, setQuantity] = useState(1);
    const[orderError, setOrderError] = useState('')

    const {id} = useParams();

    let navigate = useNavigate();

    const isSeller = currentUserId && product.seller === currentUserId;

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                const response = await productsAPI.getProduct(id);
                setProduct(response.data);
                const profileResponse = await authAPI.getProfile();
                setCurrentUserId(profileResponse.data.id);
            }catch(err){
                setErrors(err);
                console.log(err);
            }finally{
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id, navigate])

    const handleCreateOrder = async() => {
        if(!isAuthenticated()){
            navigate('/login');
        }
        if((await authAPI.getProfile()).data.user_type == 'seller'){
          return;
        }
        try{
            const orderData = {
                product_id: parseInt(id),
                quantity: parseInt(quantity),
                shipping_address: 'Адрес доставки',
            };
            const response = await ordersAPI.createOrder(orderData);
            navigate(`/orders/${response.data.id}`)
        }catch(err){
            setErrors(err);
            console.log(err);
        }
    }

    if(loading) return <div>Загрузка товара</div>;
    if(errors) return <div style={styles.error}>{errors}</div>;
    if(!product) return <div>Товар не найден</div>;

    return(
        <div style={styles.container}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>Назад</button>
            <div style={styles.productDetail}>
                {product.image && (
                    <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} style={styles.productImage}></img>
                )}
                <dib style={styles.productInfo}>
                    <h1>{product.name}</h1>
                    <p style={styles.description}>{product.description}</p>
                    <div style={styles.details}>
                        <p><strong>Цена: </strong>{product.price}₽</p>
                        <p><strong>В наличии: </strong>{product.stock} шт.</p>
                        <p><strong>Продавец: </strong>{product.seller_nae}</p>
                        <p><strong>Категория: </strong>{product.category_name}₽</p>
                    </div>
                    {isAuthenticated && !isSeller && (
                        <div style={styles.orderSection}>
                            <label>
                                Количество:
                                <input
                                    type="number"
                                    min='1'
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    style={styles.quantityInput}
                                />
                                <button onClick={handleCreateOrder} style={styles.orderButton}>Заказать</button>
                                {orderError && <div style={styles.orderError}>{orderError}</div>}
                            </label>
                        </div>
                    )}
                </dib>
            </div>
        </div>
    )
}