import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  ShieldCheck, 
  LogOut, 
  User, 
  Settings 
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['Admin', 'Analyst', 'Viewer'] },
        { name: 'Records', icon: <ReceiptIndianRupee size={20} />, path: '/records', roles: ['Admin', 'Analyst', 'Viewer'] },
        { name: 'Audit Logs', icon: <ShieldCheck size={20} />, path: '/logs', roles: ['Admin'] },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-[#060a14] border-r border-[#334155] flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-[#10B981] flex items-center gap-2">
                    <ShieldCheck size={28} /> Zorvyn
                </h1>
                <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Finance Portal</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.filter(item => item.roles.includes(user?.role)).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                            ${isActive 
                                ? 'bg-[#10B981] text-[#000] font-semibold shadow-lg shadow-emerald-500/20' 
                                : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'}
                        `}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[#334155]">
                <div className="flex items-center gap-3 px-4 py-3 text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <User size={16} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.username}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{user?.role}</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
