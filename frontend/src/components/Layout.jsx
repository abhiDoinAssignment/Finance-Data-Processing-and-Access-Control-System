import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import useAuthStore from '../store/authStore';

const Layout = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/landing" replace />;
    }

    return (
        <div className="flex w-full min-h-screen bg-slate-900 text-slate-200 font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto flex flex-col min-h-screen min-w-0 relative z-10">
                <div className="flex-1 p-8 w-full">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default Layout;
