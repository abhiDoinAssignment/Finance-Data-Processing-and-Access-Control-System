import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, Loader2, Shield, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', role_name: 'Viewer', organization_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();
  const search   = new URLSearchParams(window.location.search);
  const urlError = search.get('error');

  React.useEffect(() => {
    if (urlError === 'account_exists') {
      setError('An account with this email already exists. Please sign in.');
    }
  }, [urlError]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('[Register] Submitting registration:', form.username, form.email, 'role:', form.role_name);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, form);
      console.log('[Register] Success — redirecting to OTP verification, email:', form.email);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      console.warn('[Register] Failed:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    console.log('[Register] Initiating Google OAuth Signup with role:', form.role_name, 'org:', form.organization_name);
    const org = encodeURIComponent(form.organization_name || 'Zorvyn Global');
    window.location.href = `${API_BASE_URL}/auth/google?signup=true&role=${form.role_name}&organization_name=${org}`;
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="page-fade">

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
              NEW ACCOUNT
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Organization */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                ORGANIZATION NAME (Optional)
              </label>
              <div className="input-icon-wrap">
                <Shield size={15} className="icon-left" />
                <input type="text" className="input" placeholder="e.g. Zorvyn Global"
                  value={form.organization_name} onChange={set('organization_name')} />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                USERNAME
              </label>
              <div className="input-icon-wrap">
                <User size={15} className="icon-left" />
                <input type="text" className="input" placeholder="yourname" required
                  value={form.username} onChange={set('username')} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                EMAIL ADDRESS
              </label>
              <div className="input-icon-wrap">
                <Mail size={15} className="icon-left" />
                <input type="email" className="input" placeholder="you@example.com" required
                  value={form.email} onChange={set('email')} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                PASSWORD
              </label>
              <div className="input-icon-wrap">
                <Lock size={15} className="icon-left" />
                <input type="password" className="input" placeholder="••••••••" required
                  minLength={8} value={form.password} onChange={set('password')} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 6, lineHeight: 1.5 }}>
                Minimum 8 characters, at least one letter and one number.
              </p>
            </div>

            {/* Role selector */}
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
                ROLE
              </label>
              <div style={{ position: 'relative' }}>
                <select className="input" style={{ paddingRight: 42 }}
                  value={form.role_name} onChange={set('role_name')}>
                  <option value="Viewer">Viewer (Default) — Read only</option>
                  <option value="Analyst">Analyst — Read + Dashboard</option>
                  <option value="Admin">Admin — Full access</option>
                </select>
                <ChevronDown size={14} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-muted)', pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 4,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-error)', letterSpacing: '0.15em' }}>
                  REG_ERROR: {error}
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', height: 48, marginTop: 4 }}>
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <><span>Create Account</span><ArrowRight size={15} /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              OR SIGN UP WITH
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
            <svg width={16} height={16} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.7 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-emerald)', fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
