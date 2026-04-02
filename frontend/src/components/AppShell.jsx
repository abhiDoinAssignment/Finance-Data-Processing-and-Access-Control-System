import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ScrollText,
  LogOut,
  Menu,
  X,
  Activity,
  Database,
  Terminal
} from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';
import useAuthStore from '../store/authStore';

// ── Role colour helper ─────────────────────────────────────────────────────
const roleColor = (role) => {
  if (role === 'Admin')   return 'var(--color-emerald)';
  if (role === 'Analyst') return 'var(--color-blue)';
  return 'var(--color-muted)';
};

// ── Sidebar content  ───────────────────────────────────────────────────────
const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const role = user?.role || 'Viewer';

  const navItems = [
    { label: 'Dashboard', path: '/',        Icon: LayoutDashboard, roles: ['Admin','Analyst','Viewer'] },
    { label: 'Records',   path: '/records', Icon: FileText,         roles: ['Admin','Analyst','Viewer'] },
    { label: 'Audit Logs',path: '/logs',    Icon: ScrollText,       roles: ['Admin'] },
  ].filter(i => i.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '0 20px', height: 64, borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--color-emerald)',
            borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, color: '#fff', flexShrink: 0,
          }}>Z</div>
          <div>
            <div className="label-tiny" style={{ color: 'var(--color-muted)', lineHeight: 1 }}>INTERNAL PORTAL</div>
            <div className="label-tiny" style={{ color: 'var(--color-emerald)', lineHeight: 1, marginTop: 3 }}>ZORVYN SECURITY</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onClose}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: 16, borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 4, flexShrink: 0,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 13, color: 'var(--color-emerald)',
            overflow: 'hidden'
          }}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            ) : (
              (user?.username || 'G').charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: 'var(--color-text)',
              textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{user?.username || 'Guest'}</div>
            <div className="label-tiny" style={{ color: roleColor(role), marginTop: 2 }}>{role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', color: 'rgba(239,68,68,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.7)'}
        >
          <LogOut size={14} />
          Log Out
        </button>
      </div>
    </div>
  );
};

// ── AppShell  ──────────────────────────────────────────────────────────────
const AppShell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      <aside className="sidebar" style={{ display: 'none' }} id="desktop-sidebar">
        <SidebarContent />
      </aside>

      <style>{`
        @media (min-width: 768px) {
          #desktop-sidebar { display: flex !important; flex-direction: column; }
          #mobile-topbar   { display: none !important; }
        }
        @media (max-width: 767px) {
          #desktop-sidebar { display: none !important; }
          #mobile-topbar   { display: flex !important; }
        }
      `}</style>

      {drawerOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(8,12,20,0.75)', backdropFilter: 'blur(4px)',
          }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 400,
        width: 240, background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 200ms ease',
      }}>
        <SidebarContent onClose={() => setDrawerOpen(false)} />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        <header id="mobile-topbar" style={{
          height: 56, background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Menu size={20} />
          </button>
          <span className="label-caps" style={{ color: 'var(--color-emerald)', letterSpacing: '0.35em' }}>ZORVYN</span>
          <div style={{
            width: 34, height: 34, borderRadius: 4, flexShrink: 0,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 13, color: 'var(--color-emerald)',
            overflow: 'hidden'
          }}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            ) : (
              (user?.username || 'G').charAt(0).toUpperCase()
            )}
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: 32, paddingBottom: 64 }}>
          <div className="page-fade">
            <Outlet />
          </div>
        </main>

        <SystemStatusBar />
      </div>
    </div>
  );
};

// ── System Status Bar ──────────────────────────────────────────────────────
const SystemStatusBar = () => {
  const [status, setStatus] = useState({ ping: 'WAIT', uptime: 'WAIT', env: '...' });

  const fetchStatus = async () => {
    try {
      const healthUrl = API_BASE_URL.replace('/api', '/health');
      const res = await fetch(healthUrl);
      const data = await res.json();
      if (data.status === 'OK') {
        // Fallback to serverUptime if database.uptime is missing
        const rawUptime = (data.database && data.database.uptime) || data.serverUptime;
        setStatus({
          ping: (data.database && data.database.ping) || '0ms',
          uptime: formatUptime(rawUptime),
          env: (data.node_env || 'PROD').toUpperCase().replace('DEVELOPMENT', 'DEV')
        });
      }
    } catch (err) {
      console.warn('[SystemStatus] Health check failed');
      setStatus({ ping: 'OFFLINE', uptime: '0s', env: 'ERR' });
    }
  };

  const formatUptime = (rawSeconds) => {
    if (!rawSeconds || rawSeconds === 'WAIT' || rawSeconds === 'Unknown') return '...';
    // Remove 's' if backend appended it, then parse
    const seconds = parseInt(rawSeconds.toString().replace('s', ''));
    if (isNaN(seconds)) return '...';

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  React.useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      height: 28, 
      background: 'rgba(8,12,20,0.98)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      gap: 32,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      pointerEvents: 'none',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Activity size={10} color="var(--color-muted)" />
        <span className="label-tiny" style={{ fontSize: 7, color: 'var(--color-muted)', letterSpacing: '0.15em' }}>DB_PING:</span>
        <span style={{ fontSize: 9, fontWeight: 900, color: 'var(--color-emerald)', fontFamily: 'monospace' }}>
          {status.ping}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Database size={10} color="var(--color-muted)" />
        <span className="label-tiny" style={{ fontSize: 7, color: 'var(--color-muted)', letterSpacing: '0.15em' }}>UPTIME:</span>
        <span style={{ fontSize: 9, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
          {status.uptime}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Terminal size={10} color="var(--color-muted)" />
        <span className="label-tiny" style={{ fontSize: 7, color: 'var(--color-muted)', letterSpacing: '0.15em' }}>NODE_ENV:</span>
        <span style={{ fontSize: 9, fontWeight: 900, color: 'var(--color-blue)', fontFamily: 'monospace' }}>{status.env}</span>
      </div>
    </div>
  );
};

export default AppShell;
