import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, MailCheck } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

const DIGITS = 6;
const RESEND_COOLDOWN = 60; // seconds

const VerifyOTP = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const email     = location.state?.email || '';

  const [digits,   setDigits]   = useState(Array(DIGITS).fill(''));
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown === 0) return;
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
    console.log('[VerifyOTP] Mounted for email:', email);
  }, []);

  const handleChange = (idx, val) => {
    // Allow only a single digit
    const char = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    if (char && idx < DIGITS - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGITS);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    // Focus after last filled
    const lastIdx = Math.min(pasted.length, DIGITS - 1);
    inputRefs.current[lastIdx]?.focus();
    console.log('[VerifyOTP] Pasted OTP chars:', pasted.length);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const otp = digits.join('');
    if (otp.length < DIGITS) { setError('Please enter all 6 digits.'); return; }
    setLoading(true);
    setError('');
    console.log('[VerifyOTP] Submitting OTP for:', email, '| code:', otp);
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
      console.log('[VerifyOTP] Verification success → redirecting to login');
      setSuccess('Email verified! Redirecting to login…');
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP.';
      console.warn('[VerifyOTP] Failed:', msg);
      setError(msg);
      setDigits(Array(DIGITS).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError('');
    console.log('[VerifyOTP] Resending OTP to:', email);
    try {
      await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
      console.log('[VerifyOTP] OTP resent successfully');
      setCountdown(RESEND_COOLDOWN);
      setDigits(Array(DIGITS).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.warn('[VerifyOTP] Resend failed:', err.response?.data?.message);
      setError(err.response?.data?.message || 'Could not resend code. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="page-fade">
        <div className="card" style={{ padding: 40 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 4, margin: '0 auto 20px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-emerald)',
            }}>
              <MailCheck size={24} />
            </div>
            <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 8 }}>
              EMAIL VERIFICATION
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)', marginBottom: 12 }}>
              Enter verification code
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 }}>
              We sent a 6-digit code to{' '}
              <strong style={{ color: 'var(--color-text)' }}>{email || 'your email'}</strong>.
              It expires in 10 minutes.
            </p>
          </div>

          {/* OTP boxes */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}
              onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                />
              ))}
            </div>

            {/* Success */}
            {success && (
              <div style={{
                padding: '10px 14px', borderRadius: 4, marginBottom: 16,
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-emerald)' }}>{success}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 4, marginBottom: 16,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-error)', letterSpacing: '0.15em' }}>
                  OTP_ERROR: {error}
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', height: 48 }}>
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : 'Verify Code'
              }
            </button>
          </form>

          {/* Resend */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            {countdown > 0 ? (
              <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Resend code in{' '}
                <span className="font-mono-ui" style={{ color: 'var(--color-emerald)' }}>{countdown}s</span>
              </p>
            ) : (
              <button onClick={handleResend} disabled={resending}
                style={{ fontSize: 12, color: 'var(--color-emerald)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                {resending ? 'Sending…' : 'Resend Code'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
