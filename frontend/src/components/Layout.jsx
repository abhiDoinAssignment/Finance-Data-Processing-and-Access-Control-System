import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../store/authStore';

const Layout = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex w-full min-h-screen bg-[#0F172A] text-slate-200">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
                
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
