import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

const LegalDisclaimer = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass-panel max-w-lg w-full p-8 rounded-[32px] relative overflow-hidden shadow-2xl border-white/10">
                {/* Top Highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 mb-6 font-black">
                        <ShieldAlert size={32} strokeWidth={1.5} />
                    </div>
                    
                    <h2 className="text-2xl font-black text-white tracking-tight mb-4 uppercase italic">Project Disclosure</h2>
                    
                    <div className="space-y-4 text-slate-400 text-sm font-medium leading-relaxed mb-8">
                        <p>
                            This platform, <span className="text-emerald-500 font-bold italic">Zorvyn Finance</span>, is a technical/academic assignment created for demonstration purposes only.
                        </p>
                        <p>
                            No actual financial transactions are processed, and all data presented is synthetic. This project serves as a showcase for 
                            <span className="text-white font-bold tracking-tight"> Full-Stack Engineering, Real-Time Data Streaming, and RBAC Security</span>.
                        </p>
                        <p className="text-[11px] opacity-60 uppercase font-black tracking-widest">
                            Zorvyn Finance Concept © 2026 Abhishek Saini
                        </p>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs tracking-widest hover:bg-white/10 transition-all uppercase"
                    >
                        Acknowledge Protocol
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalDisclaimer;
