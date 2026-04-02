import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';
import Footer from '../components/Footer';

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
            setError(err.response?.data?.message || 'Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-base w-full px-6 overflow-x-hidden relative font-['Inter']">
            <div className="w-full max-w-md py-12 flex-1 flex flex-col justify-center relative z-10">
                <div className="bg-slate-surface/20 fine-border p-12 pb-16 rounded-sm relative overflow-hidden">
                    <div className="flex flex-col items-center mb-14 text-center">
                        <div className="w-16 h-16 bg-emerald-accent/10 rounded-sm flex items-center justify-center text-emerald-accent border border-emerald-accent/20 mb-10 group hover:scale-110 transition-all shadow-xl shadow-emerald-500/5">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-3 uppercase italic text-gradient">Verify Uplink</h1>
                        <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[9px] ml-1">Secondary Handshake Required</p>
                        <p className="mt-4 text-[10px] text-slate-400 font-medium tracking-tight">Code transmitted to: <span className="text-emerald-500">{email || 'PROTOCOL_ERROR'}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.4em] ml-1 opacity-70">Transmission Code</label>
                            <input 
                                type="text" 
                                className="input-field !text-center !text-2xl !tracking-[1em] !font-mono !bg-slate-base/50"
                                placeholder="000000"
                                maxLength={6}
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/5 border border-red-500/10 py-4 px-6 rounded-sm">
                                <p className="text-[10px] text-red-500 font-black text-center tracking-widest uppercase italic">X_AUTH_ERROR: {error}</p>
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="btn-primary w-full flex items-center justify-center gap-4 h-16 text-xs tracking-widest uppercase shadow-xl shadow-emerald-600/10"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <> VALIDATE UPLINK <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> </>}
                        </button>
                    </form>

                    <p className="mt-16 text-center text-[9px] text-slate-600 font-black tracking-widest uppercase">
                        Signal Lost? <button type="button" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors ml-1 underline underline-offset-8 decoration-emerald-500/20">Request Retransmit</button>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default VerifyOTP;
