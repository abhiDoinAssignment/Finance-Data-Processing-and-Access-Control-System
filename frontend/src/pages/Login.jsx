import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Loader2, ArrowRight, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { API_BASE_URL } from '../config/apiConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const loginStore = useAuthStore(state => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            loginStore(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A] w-screen px-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-sm">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 mb-4">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Access Secure Portal</h1>
                        <p className="text-slate-500 text-sm mt-1">Enter credentials to proceed</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    className="input-field pl-10"
                                    placeholder="name@vantagetasks.online"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full flex items-center justify-center gap-2 group h-12"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <> Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-600 bg-[#0F172A] px-2 w-fit mx-auto">Or Social Sync</div>
                        </div>
                        
                        <button 
                            onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 transition-all text-sm font-semibold"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" /> Continue with Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-500">
                        Restricted Access. <Link to="/register" className="text-emerald-500 font-bold hover:underline">Request Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
