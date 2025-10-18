import React from 'react';
// Импортируем BrowserRouter для маршрутизации
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Импортируем страницы (их создадим дальше)
import Login from './pages/Login';
import Register from './pages/Register';
import PersonAccountPage from './pages/PersonalAccountPage';
import ProductsListPage from './pages/ProductsList';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CreateProductPage from './pages/CreateProductPage';

// Главный компонент приложения
function App() {
  return (
    // Оборачиваем всё приложение в Router для маршрутизации
    <Router>
      {/* Основной контейнер */}
      <div className="App">
        {/* Определяем маршруты */}
        <Routes>
          {/* Маршрут для страницы входа */}
          <Route path="/login" element={<Login />} />
          {/* Маршрут для страницы регистрации */}
          <Route path="/register" element={<Register />} />
          {/* Маршрут по умолчанию (временно) */}
          <Route path="/" element={<ProductsListPage/>} />
          <Route path="/account" element={<PersonAccountPage/>}/>
          <Route path='/product/:id/' element={<ProductDetailPage/>}/>
          <Route path='/orders/' element={<OrderListPage/>}/>
          <Route path='/orders/:id/' element={<OrderDetailPage/>}></Route>
          <Route path='/products/create/' element={<CreateProductPage></CreateProductPage>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

// Экспортируем компонент
export default App;