import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Database, 
  Activity, 
  LogOut, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { API_BASE_URL } from '../config/apiConfig';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Terminal', path: '/', icon: Terminal, roles: ['Admin', 'Analyst', 'Viewer'] },
    { name: 'Records', path: '/records', icon: Database, roles: ['Admin', 'Analyst', 'Viewer'] },
    { name: 'Security Logs', path: '/logs', icon: Activity, roles: ['Admin'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = user?.role || 'Viewer';

  return (
    <aside
      className={`relative h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-in-out shrink-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-50 w-6 h-6 bg-slate-800 border border-brand-green/20 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-green hover:border-brand-green/50 transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-slate-700/50 min-h-[64px] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-brand-green rounded-sm flex items-center justify-center font-black text-slate-900 text-sm shrink-0 shadow-lg shadow-brand-green/20">
          Z
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-black tracking-tight text-white uppercase text-[10px] block leading-none">Internal Portal</span>
            <span className="text-[8px] text-brand-green font-bold uppercase tracking-widest mt-1 block truncate">
              {user?.org_name || 'Zorvyn Global'}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-1 px-3 overflow-hidden">
        {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all group relative ${
                isActive
                  ? 'bg-brand-green/10 text-brand-green border-l-2 border-brand-green'
                  : 'text-slate-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon size={16} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`p-4 border-t border-slate-700/50 space-y-3 bg-slate-800/30 ${collapsed ? 'items-center flex flex-col' : ''}`}>
        <div className={`flex items-center gap-3 px-2 py-1 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-green font-black text-xs shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              user?.username?.charAt(0).toUpperCase() || 'G'
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase tracking-tight truncate leading-none">{user?.username || 'GUEST'}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 rounded-full bg-brand-green animate-pulse shrink-0" />
                <p className={`text-[8px] font-bold uppercase tracking-widest truncate ${
                  userRole === 'Admin' ? 'text-brand-green' : 
                  userRole === 'Analyst' ? 'text-blue-400' : 'text-slate-400'
                }`}>
                  {userRole}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Terminate Session' : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-all w-full border border-transparent hover:border-red-500/20 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={14} className="shrink-0" />
          {!collapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
