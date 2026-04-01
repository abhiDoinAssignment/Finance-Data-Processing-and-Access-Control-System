import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

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
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A] w-screen px-4 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
            </div>

            <div className="w-full max-w-sm">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 mb-4">
                            <User size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                        <p className="text-slate-500 text-sm mt-1">Request access to Zorvyn Finance</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input 
                                    type="text" 
                                    className="input-field pl-10"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input 
                                    type="email" 
                                    className="input-field pl-10"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input 
                                    type="password" 
                                    className="input-field pl-10"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Desired Role</label>
                            <select 
                                className="input-field py-2"
                                value={formData.role_name}
                                onChange={(e) => setFormData({...formData, role_name: e.target.value})}
                            >
                                <option value="Viewer">Viewer (Read-only)</option>
                                <option value="Analyst">Analyst (Summaries + Read)</option>
                                <option value="Admin">Admin (Full Access)</option>
                            </select>
                        </div>

                        {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-500 text-white w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <> Register Now <ArrowRight size={18} /> </>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-500">
                        Already have access? <Link to="/login" className="text-blue-400 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
