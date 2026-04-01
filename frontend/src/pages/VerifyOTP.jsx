import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('pending_email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return setError('Session expired. Please register again.');
        
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            localStorage.removeItem('pending_email');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A] w-screen px-4">
            <div className="w-full max-w-sm">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative">
                    <button 
                        onClick={() => navigate('/register')}
                        className="absolute left-6 top-6 text-slate-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex flex-col items-center mb-8 text-center mt-4">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20 mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Check Your Inbox</h1>
                        <p className="text-slate-500 text-sm mt-1 max-w-[250px]">
                            We've sent a code to <span className="text-slate-300 font-semibold">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center block w-full">Verification Code</label>
                            <input 
                                type="text" 
                                className="bg-[#0b1120] border-2 border-slate-800 focus:border-emerald-500 text-center text-3xl font-bold tracking-[10px] py-4 rounded-xl w-full outline-none transition-all text-white h-16"
                                placeholder="000000"
                                maxLength={6}
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="bg-emerald-500 hover:bg-emerald-400 text-black w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Confirm Verification"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-500">
                        Didn't receive the email? <button className="text-emerald-500 font-bold hover:underline">Resend Code</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
