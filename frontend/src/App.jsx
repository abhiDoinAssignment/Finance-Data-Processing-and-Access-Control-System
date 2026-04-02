import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Pages
import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import Records   from './pages/Records';
import Logs      from './pages/Logs';
import ApiDocs   from './pages/ApiDocs';

// Layout
import AppShell from './components/AppShell';

// ── Google OAuth redirect handler ──────────────────────────────────────────
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    if (token) {
      let user = { username: 'Google User', role: 'Viewer' };
      try {
        if (userParam) {
          user = JSON.parse(decodeURIComponent(userParam));
        }
      } catch (err) {
        console.error('[AuthCallback] Failed to parse user data:', err);
      }
      
      console.log('[AuthCallback] OAuth session active:', user.username);
      login(token, user);
      navigate('/', { replace: true });
    } else {
      console.warn('[AuthCallback] No token in OAuth callback — redirecting to login');
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="font-mono-ui text-em label-caps" style={{ letterSpacing: '0.3em' }}>
        Authorizing session…
      </div>
    </div>
  );
};

// ── Protected route wrapper ────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated — redirecting to landing');
    return <Navigate to="/landing" replace />;
  }
  return children;
};

// ── Public-only route wrapper (redirect logged-in users away) ─────────────
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  const { checkTokenExpiry } = useAuthStore();

  useEffect(() => {
    checkTokenExpiry();
    console.log('[App] Token expiry check complete');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/landing"    element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login"      element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"   element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/docs" element={<ApiDocs />} />

        {/* Protected app shell */}
        <Route element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/logs"    element={<Logs />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
