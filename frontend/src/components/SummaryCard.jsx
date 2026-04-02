import React from 'react';

const SummaryCard = ({ title, value, icon, change, isPositive }) => {
    // Basic sparkline generation based on a hash of the value or title for visual flair
    const data = [30, 45, 32, 64, 52, 78, 65];
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 60},${40 - (d / 100) * 35}`).join(' ');

    return (
        <div className="feature-card p-6 flex flex-col gap-6 group">
            <div className="card-circuit opacity-10" />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-brand-green/5 text-brand-green rounded-sm border border-brand-green/20 group-hover:bg-brand-green group-hover:text-slate-900 transition-all duration-300">
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-2xl font-black text-white tracking-tighter mt-1 italic">
                        ₹{value?.toLocaleString() || 0}
                    </h3>
                </div>
            </div>
            
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-slate-800/50">
                <div className="flex flex-col gap-1">
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isPositive ? 'text-brand-green' : 'text-red-500'}`}>
                        {isPositive ? '↑' : '↓'} {change}%
                        <span className="text-slate-600 ml-1">Delta</span>
                    </div>
                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">vs previous cycle</p>
                </div>

                {/* Minimal Sparkline SVG */}
                <div className="w-16 h-10 opacity-40 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 60 40" className="w-full h-full">
                        <polyline
                            fill="none"
                            stroke={isPositive ? "#20C873" : "#EF4444"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                        />
                    </svg>
                </div>
            </div>

            {/* Bottom Glow Segment */}
            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-brand-green/40 to-transparent w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
        </div>
    );
};

export default SummaryCard;
