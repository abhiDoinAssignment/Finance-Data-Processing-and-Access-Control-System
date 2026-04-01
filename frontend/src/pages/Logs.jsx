import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Search, 
  History, 
  User, 
  Settings, 
  Database, 
  Terminal 
} from 'lucide-react';
import axios from 'axios';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(l => 
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (action) => {
        if (action.includes('USER')) return <User size={14} className="text-blue-400" />;
        if (action.includes('RECORD')) return <Database size={14} className="text-emerald-400" />;
        return <Activity size={14} className="text-slate-400" />;
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                    <History size={32} className="text-emerald-500" /> System Audit Trail
                </h2>
                <p className="text-slate-400 mt-1">Real-time event stream for system activity and security monitoring.</p>
            </header>

            <div className="glass-panel p-4 rounded-xl flex gap-4 items-center">
                <Search className="text-slate-500 ml-2" size={18} />
                <input 
                    type="text" 
                    placeholder="Search actions or users..." 
                    className="bg-transparent border-none outline-none flex-1 text-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-panel p-2 rounded-2xl border border-white/5 bg-[#060a14]/50">
                <div className="flex bg-slate-800/30 font-mono text-[10px] py-2 px-6 text-slate-500 uppercase tracking-tighter rounded-t-xl mb-1">
                    <span className="w-1/4">Timestamp</span>
                    <span className="w-1/4">User</span>
                    <span className="w-1/4">Action</span>
                    <span className="flex-1">Details</span>
                </div>
                <div className="max-h-[600px] overflow-y-auto space-y-1 p-1 terminal-scroll">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="flex items-center gap-4 py-3 px-5 hover:bg-white/5 transition-all rounded-lg font-mono text-xs border border-transparent hover:border-white/5">
                            <span className="w-1/4 text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                            <span className="w-1/4 flex items-center gap-2 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-slate-700" />
                                {log.user || 'System'}
                            </span>
                            <span className="w-1/4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1.5 ${
                                    log.action.includes('RECORD') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-300'
                                }`}>
                                    {getIcon(log.action)}
                                    {log.action}
                                </span>
                            </span>
                            <span className="flex-1 text-slate-500 truncate max-w-xs">{JSON.stringify(log.details)}</span>
                        </div>
                    ))}
                    {loading && (
                        <div className="py-20 text-center animate-pulse text-emerald-500 text-sm italic font-mono">
                             fetching encrypted traces...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Logs;
