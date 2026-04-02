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
      className={`relative h-screen bg-[#0F172A] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-20 w-6 h-6 bg-[#1E293B] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-white/5 min-h-[64px] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 bg-emerald-500 rounded-sm flex items-center justify-center font-black text-[#0F172A] text-xs shrink-0 shadow-lg shadow-emerald-500/20">
          A
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-black tracking-tight text-white uppercase text-[10px] block leading-none">Internal Portal</span>
            <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5 block">Zorvyn Security</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
        {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all group relative ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
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
      <div className={`p-3 border-t border-white/5 space-y-2 ${collapsed ? 'items-center flex flex-col' : ''}`}>
        <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-sm bg-[#1E293B] border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
            <User size={14} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase tracking-tight truncate leading-none">{user?.username || 'GUEST'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest truncate">{user?.role || 'RESTRICTED'}</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Terminate Session' : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={14} className="shrink-0" />
          {!collapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
