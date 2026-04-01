import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Terminal, Shield, RefreshCcw, Search, Clock, User, Globe } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/admin/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Audit Trail</h1>
                        <p className="text-slate-500 text-sm">Real-time forensic event monitoring</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Filter logs..."
                            className="bg-slate-900 border border-slate-800 text-sm rounded-xl py-2 pl-10 pr-4 text-slate-300 focus:outline-none focus:border-emerald-500/50 w-full md:w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all border border-slate-700"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Event</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Origin / Agent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Clock size={14} className="text-slate-500" />
                                            <span className="text-xs font-mono">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-emerald-500 font-bold border border-emerald-500/30">
                                                {log.user?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm text-slate-300 font-medium">{log.user || 'System'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase border ${
                                            log.action.includes('REGISTER') || log.action.includes('VERIFY')
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : log.action.includes('LOGIN')
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                            <Shield size={10} />
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                                                <Globe size={12} className="text-slate-600" />
                                                <span>{log.ip_address || 'Internal'}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-600 truncate max-w-[200px]" title={log.user_agent}>
                                                {log.user_agent || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Logs;
