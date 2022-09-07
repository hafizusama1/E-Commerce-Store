import React from 'react';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import SigninPage from './pages/SigninPage';
import ShippingPage from './pages/ShippingPage';
import SignupPage from './pages/SignupPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './routes/AdminRoute';

function App() {
  return (
    <div className="d-flex flex-column site-container">
      <ToastContainer position="bottom-center" limit={1} />
      <NavBar />
      <main>
        <Container className="mt-5">
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/*Admin Routes*/}

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
