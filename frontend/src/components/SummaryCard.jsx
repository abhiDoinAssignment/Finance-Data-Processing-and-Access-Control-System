import React from 'react';

const SummaryCard = ({ title, value, icon, change, isPositive }) => {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold mt-1">₹{value.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm mt-2">
                {change && (
                    <>
                        <span className={`font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isPositive ? '↑' : '↓'} {change}%
                        </span>
                        <span className="text-slate-500">vs last month</span>
                    </>
                )}
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
        </div>
    );
};

export default SummaryCard;
