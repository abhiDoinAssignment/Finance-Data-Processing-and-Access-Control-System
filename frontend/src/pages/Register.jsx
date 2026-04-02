import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';
import Footer from '../components/Footer';

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '',
        role_name: 'Viewer' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, formData);
            localStorage.setItem('pending_email', formData.email);
            navigate('/verify-otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Unsuccessful');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-base w-full px-6 overflow-x-hidden relative font-['Inter']">
            <div className="w-full max-w-md py-12 flex-1 flex flex-col justify-center relative z-10">
                <div className="bg-slate-surface/20 fine-border p-12 pb-16 rounded-sm relative overflow-hidden">
                    <div className="flex flex-col items-center mb-14 text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-sm flex items-center justify-center text-blue-500 border border-blue-500/20 mb-10 group hover:scale-110 transition-all shadow-xl shadow-blue-500/5">
                            <User size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-3 uppercase italic text-gradient">Create Identity</h1>
                        <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[9px] ml-1">New Protocol Initialization</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Identity Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    className="input-field !pl-16 !bg-slate-base/50"
                                    placeholder="Enter full name"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Comm Uplink</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    className="input-field !pl-16 !bg-slate-base/50"
                                    placeholder="name@domain.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Encryption Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    className="input-field !pl-16 !bg-slate-base/50"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Privilege Level</label>
                            <select 
                                className="input-field !bg-slate-base/50 appearance-none cursor-pointer focus:border-blue-500/40"
                                value={formData.role_name}
                                onChange={(e) => setFormData({...formData, role_name: e.target.value})}
                            >
                                <option value="Viewer">Viewer (Read-only)</option>
                                <option value="Analyst">Analyst (Power User)</option>
                                <option value="Admin">Admin (Core Control)</option>
                            </select>
                        </div>

                        {error && (
                            <div className="bg-red-500/5 border border-red-500/10 py-4 px-6 rounded-sm">
                                <p className="text-[10px] text-red-500 font-black text-center tracking-widest uppercase italic">INIT_ERROR: {error}</p>
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full h-16 bg-blue-600 text-white rounded-sm font-black tracking-widest text-[11px] uppercase flex items-center justify-center gap-4 transition-all hover:bg-blue-500 active:scale-[0.98] shadow-xl shadow-blue-600/10"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <> INITIATE UPLINK <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> </>}
                        </button>
                    </form>

                    <p className="mt-16 text-center text-[9px] text-slate-600 font-black tracking-widest uppercase">
                        Active Identity? <Link to="/login" className="text-blue-500 font-black hover:text-blue-400 transition-colors ml-1 underline underline-offset-8 decoration-blue-500/20">Authorize Link</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
