import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';

// Lazy-loaded pages for code splitting
const Home           = lazy(() => import('./pages/Home'));
const Products       = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart           = lazy(() => import('./pages/Cart'));
const Wishlist       = lazy(() => import('./pages/Wishlist'));
const Login          = lazy(() => import('./pages/Login'));
const Register       = lazy(() => import('./pages/Register'));
const Checkout       = lazy(() => import('./pages/Checkout'));
const NotFound       = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/products"        element={<Products />} />
          <Route path="/products/:id"    element={<ProductDetails />} />
          <Route path="/cart"            element={<Cart />} />
          <Route path="/wishlist"        element={<Wishlist />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/checkout"        element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
