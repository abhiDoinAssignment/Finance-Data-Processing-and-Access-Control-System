import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Loader2, ArrowRight, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { API_BASE_URL } from '../config/apiConfig';
import Footer from '../components/Footer';

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
            setError(err.response?.data?.message || 'Authentication Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-base w-full px-6 overflow-x-hidden relative font-['Inter']">
            <div className="w-full max-w-md py-12 flex-1 flex flex-col justify-center relative z-10">
                <div className="bg-slate-surface/20 fine-border p-12 pb-16 rounded-sm relative overflow-hidden">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <div className="w-16 h-16 bg-emerald-accent/10 rounded-sm flex items-center justify-center text-emerald-accent border border-emerald-accent/20 mb-10 group hover:scale-110 transition-all shadow-xl shadow-emerald-500/5">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-3 uppercase italic">System Access</h1>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[9px]">Authorization Required</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Identity Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    className="input-field !pl-16 !bg-slate-base/50"
                                    placeholder="name@domain.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    className="input-field !pl-16 !bg-slate-base/50"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/5 border border-red-500/10 py-4 px-6 rounded-sm">
                                <p className="text-[10px] text-red-500 font-black text-center tracking-widest uppercase">CRITICAL_ERROR: {error}</p>
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full flex items-center justify-center gap-4 h-16 text-xs tracking-widest"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <> INITIATE UPLINK <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> </>}
                        </button>
                    </form>

                    <div className="mt-16 flex flex-col gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.05]"></div></div>
                            <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.4em] text-slate-600 px-4 bg-[#0F172A]">
                                Tertiary Handshake
                            </div>
                        </div>
                        
                        <button 
                            type="button"
                            className="w-full h-14 flex items-center justify-center gap-4 px-8 rounded-sm bg-white/[0.02] text-slate-500 border border-white/[0.05] hover:bg-white/[0.05] hover:text-white transition-all text-[9px] font-black tracking-widest active:scale-[0.98]"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-40 group-hover:opacity-100" /> 
                            <span>GOOGLE_SSO_AUTH</span>
                        </button>
                    </div>

                    <p className="mt-16 text-center text-[9px] text-slate-600 font-black tracking-widest uppercase">
                        Unregistered? <Link to="/register" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors ml-1 underline underline-offset-8 decoration-emerald-500/20">Create Session</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
