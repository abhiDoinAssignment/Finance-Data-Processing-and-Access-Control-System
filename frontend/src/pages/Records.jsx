import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit2, 
  Download 
} from 'lucide-react';
import useFinanceStore from '../store/financeStore';
import useAuthStore from '../store/authStore';

const Records = () => {
    const { records, fetchRecords, deleteRecord, loading } = useFinanceStore();
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        fetchRecords();
    }, []);

    const filteredRecords = records.filter(r => {
        const matchesSearch = r.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             r.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || r.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            await deleteRecord(id);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Financial Records</h2>
                    <p className="text-slate-400 mt-1">Full transaction history and management.</p>
                </div>
                {user?.role === 'Admin' && (
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={20} /> Add New Record
                    </button>
                )}
            </header>

            <div className="glass-panel p-6 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search categories or descriptions..." 
                            className="input-field pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="input-field max-w-[150px] h-10 py-0"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-all">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-2xl border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRecords.map((r) => (
                                <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        {new Date(r.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-200">{r.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-500 max-w-xs truncate">{r.description || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full ${
                                            r.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                            {r.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${
                                        r.type === 'Income' ? 'text-emerald-500' : 'text-slate-100'
                                    }`}>
                                        {r.type === 'Expense' ? '-' : '+'}₹{r.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user?.role === 'Admin' && (
                                                <>
                                                    <button className="p-1.5 text-slate-400 hover:text-emerald-500 transition-all">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                      onClick={() => handleDelete(r.id)}
                                                      className="p-1.5 text-slate-400 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredRecords.length === 0 && !loading && (
                    <div className="p-12 text-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                            <Filter size={32} />
                        </div>
                        <p>No records found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Records;
