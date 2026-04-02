import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ── Cursor Background Effect ─────────────────────────────────────────────────
// Only attach on pointer-fine devices (skip on touch/mobile)
if (window.matchMedia('(pointer: fine)').matches) {
  let rafId = null;
  window.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--cx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cy', `${e.clientY}px`);
      rafId = null;
    });
  });
  console.log('[CursorBG] Attached mousemove listener (pointer:fine device)');
} else {
  console.log('[CursorBG] Touch device detected — cursor effect disabled');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
