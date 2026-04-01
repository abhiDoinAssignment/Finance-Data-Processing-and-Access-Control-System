import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('pending_email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
            localStorage.removeItem('pending_email');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A] w-screen px-4 overflow-hidden relative">
            <div className="w-full max-w-sm">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl text-center">
                    <Shield className="mx-auto mb-6 text-emerald-500" size={48} />
                    <h1 className="text-2xl font-bold text-white mb-2">Verify Identity</h1>
                    <p className="text-slate-500 text-sm mb-8">Enter the 6-digit code sent to {email}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input 
                            type="text" 
                            maxLength={6}
                            className="input-field text-center text-2xl tracking-[0.5em] font-mono h-16"
                            placeholder="000000"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        />

                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full h-12 rounded-xl flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <> Confirm Access <ArrowRight size={18} /> </>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
