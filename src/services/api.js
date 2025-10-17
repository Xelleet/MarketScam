import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token){
            config.headers.Authorization = `Token ${token}`;
        }
        return config
    },
    (errors) => {
        return Promise.reject(errors);
    }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  registerProfile: (profileData, token) => api.post('/auth/register/profile/', profileData, {
    headers: {
    'Authorization': `Token ${token}`
  }
  }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  updateBuyerProfile: (data) => api.put('/auth/profile/buyer/', data),
  updateSellerProfile: (data) => api.put('/auth/profile/seller/', data),
};

export const productsAPI = {
      getProducts: () => api.get('/products/'),
      getProduct: (id) => api.get(`products/${id}/`),
      createProduct: (data) => api.post('/products/', data),
      updateProduct: (id, data) => api.put(`/products/${id}`, data),
      deleteProduct: (id) => api.delete(`/products/${id}`),
}

export const ordersAPI = {
    getOrders: () => api.get('/orders/'),
    getOrder: (id) => api.get(`/orders/${id}`),
    createOrder: (data) => api.post('/orders/create/', data),
    updateOrder: (id, data) => api.put(`/orders/${id}`, data),
}