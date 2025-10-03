import axios from "axios";

export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
    if (token){
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
    else{
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
}

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};