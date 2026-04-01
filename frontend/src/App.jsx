import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import useAuthStore from './store/authStore';

// Page Imports
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Logs from './pages/Logs';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';

// Handling Google OAuth Redirect
const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const { login } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Fetch profile would be better, but we'll decode if it were complete
            // For now, redirect to login to ensure fresh session or handle as success
            login(token, { username: 'Google User', role: 'Viewer' }); 
            navigate('/');
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-[#0F172A] text-emerald-500">
            <div className="animate-pulse">Authorizing session...</div>
        </div>
    );
};

function App() {
  const { checkTokenExpiry } = useAuthStore();

  useEffect(() => {
    checkTokenExpiry();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Dashboard Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/logs" element={<Logs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
