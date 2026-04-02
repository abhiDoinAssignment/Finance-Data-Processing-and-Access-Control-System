import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Loader2, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { API_BASE_URL } from '../config/apiConfig';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate   = useNavigate();
  const loginStore = useAuthStore(s => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('[Login] Attempting login for:', email);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      console.log('[Login] Success — user:', res.data.user);
      loginStore(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Check credentials.';
      console.warn('[Login] Failed:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    console.log('[Login] Initiating Google OAuth');
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="page-fade">

        {/* Card */}
        <div className="card" style={{ padding: 40 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 4, margin: '0 auto 20px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-emerald)',
            }}>
              <Shield size={24} />
            </div>
            <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 8 }}>
              SECURE ACCESS
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
              Sign in to Zorvyn
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                EMAIL ADDRESS
              </label>
              <div className="input-icon-wrap">
                <Mail size={15} className="icon-left" />
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                PASSWORD
              </label>
              <div className="input-icon-wrap">
                <Lock size={15} className="icon-left" />
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 4,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-error)', letterSpacing: '0.15em' }}>
                  AUTH_ERROR: {error}
                </span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', height: 48, marginTop: 4 }}>
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <><span>Sign In</span><ArrowRight size={15} /></>
              }
            </button>
          </form>

          {/* Quick Access Roles */}
          <div style={{ marginTop: 24 }}>
            <div className="label-tiny" style={{ color: 'var(--color-muted)', textAlign: 'center', marginBottom: 12 }}>
              QUICK ACCESS (DEV/TEST)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Admin',   email: 'admin@abc.com',   color: 'var(--color-emerald)' },
                { label: 'Analyst', email: 'analyst@abc.com', color: 'var(--color-blue)' },
                { label: 'Viewer',  email: 'viewer@abc.com',  color: 'var(--color-muted)' },
              ].map(role => (
                <button
                  key={role.label}
                  type="button"
                  className="btn btn-ghost"
                  disabled={loading}
                  onClick={() => {
                    setEmail(role.email);
                    setPassword('Zorvyn2024!');
                    // Small delay to allow state update if needed, though not strictly required for form submit
                    setTimeout(() => document.querySelector('form').requestSubmit(), 50);
                  }}
                  style={{ 
                    fontSize: 10, height: 32, padding: 0, 
                    border: `1px solid rgba(255,255,255,0.05)`,
                    color: role.color 
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              OR CONTINUE WITH
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogle}
            className="btn btn-ghost"
            style={{ width: '100%', height: 44, gap: 12 }}
          >
            {/* Google G logo */}
            <svg width={16} height={16} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.7 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer links */}
          <div style={{ marginTop: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              No account?{' '}
              <Link to="/register" style={{ color: 'var(--color-emerald)', fontWeight: 700, textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
            <Link to="/landing" style={{ fontSize: 11, color: 'rgba(100,116,139,0.6)', textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </div>
        </div>

        {/* System version watermark */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span className="font-mono-ui" style={{ fontSize: 9, color: 'rgba(100,116,139,0.3)', letterSpacing: '0.2em' }}>
            ZORVYN_FINANCE // v2.0 // SECURE_CHANNEL
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
