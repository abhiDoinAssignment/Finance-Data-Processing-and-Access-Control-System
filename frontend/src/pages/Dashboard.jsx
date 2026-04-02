import React, { useEffect } from 'react';
import { 
    TrendingUp, 
    TrendingDown, 
    Wallet, 
    ArrowUpRight, 
    ArrowDownRight 
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import SummaryCard from '../components/SummaryCard';
import useFinanceStore from '../store/financeStore';

const Dashboard = () => {
    const { summary, fetchSummary, loading } = useFinanceStore();

    useEffect(() => {
        fetchSummary();
    }, []);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-transparent" />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Loading Terminal...</p>
                </div>
            </div>
        );
    }

    // If no summary data, show empty state instead of blank screen
    if (!summary) {
        return (
            <div className="space-y-8">
                <header className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Dashboard</p>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic">Finance Terminal</h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">No data available — add records to get started.</p>
                    </div>
                </header>
                <div className="fine-border p-12 text-center text-slate-600 font-black text-[10px] uppercase tracking-widest">
                    No Financial Data Loaded. Navigate to Records to add transactions.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Dashboard</p>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic">Finance Terminal</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Real-time financial performance and analytics.</p>
                </div>
                <div className="text-[9px] font-black text-slate-600 bg-white/[0.03] px-4 py-2 rounded-sm border border-white/5 uppercase tracking-widest">
                    Live · {new Date().toLocaleDateString()}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard 
                    title="Total Income" 
                    value={summary.totalIncome} 
                    icon={<TrendingUp size={24} />} 
                    change={12.5} 
                    isPositive={true} 
                />
                <SummaryCard 
                    title="Total Expenses" 
                    value={summary.totalExpenses} 
                    icon={<TrendingDown size={24} />} 
                    change={4.2} 
                    isPositive={false} 
                />
                <SummaryCard 
                    title="Net Balance" 
                    value={summary.netBalance} 
                    icon={<Wallet size={24} />} 
                    change={8.3} 
                    isPositive={true} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Trends Area Chart */}
                <div className="glass-panel p-8 rounded-3xl min-h-[400px]">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h4 className="text-xl font-bold text-slate-100">Monthly Trends</h4>
                            <p className="text-sm text-slate-400">Comparing Income vs Expenses over time.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary.monthlyTrends}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94A3B8" />
                                <YAxis stroke="#94A3B8" />
                                <Tooltip 
                                    contentStyle={{ background: '#1E293B', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#F8FAFC' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown Bar Chart */}
                <div className="glass-panel p-8 rounded-3xl min-h-[400px]">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h4 className="text-xl font-bold text-slate-100">Allocation by Category</h4>
                            <p className="text-sm text-slate-400">Spending and income distribution across categories.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={summary.categoryTotals}>
                                <XAxis dataKey="category" stroke="#94A3B8" />
                                <YAxis stroke="#94A3B8" />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                    {summary.categoryTotals.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
