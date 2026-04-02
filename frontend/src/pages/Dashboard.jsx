import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Wallet,
  RefreshCw, ArrowUpRight, ArrowDownRight,
  FileText, Calendar,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import useFinanceStore from '../store/financeStore';
import useAuthStore    from '../store/authStore';

// ── Colour palette for category bars ─────────────────────────────────────
const BAR_COLORS = ['#10B981','#3B82F6','#F59E0B','#EF4444','#8B5CF6'];

// ── Custom chart tooltip ──────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '12px 16px', minWidth: 160 }}>
      <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 10 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'block' }} />
            <span className="label-tiny" style={{ color: 'var(--color-muted)' }}>{p.name}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text)' }}>
            ₹{Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const CatTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '10px 14px' }}>
      <span className="font-mono-ui" style={{ color: 'var(--color-emerald)', fontSize: 11, fontWeight: 700 }}>
        ₹{Number(payload[0].value).toLocaleString()}
      </span>
    </div>
  );
};

// ── Summary Card ──────────────────────────────────────────────────────────
const SummaryCard = ({ title, value, Icon, change, isPositive }) => (
  <div className="card" style={{ padding: 24 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div className="label-tiny" style={{ color: 'var(--color-muted)' }}>{title}</div>
      <div style={{
        width: 34, height: 34, borderRadius: 4,
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-emerald)',
      }}>
        <Icon size={15} />
      </div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--color-text)', marginBottom: 10 }}>
      ₹{Number(value || 0).toLocaleString()}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {isPositive
        ? <ArrowUpRight size={13} style={{ color: 'var(--color-emerald)' }} />
        : <ArrowDownRight size={13} style={{ color: 'var(--color-error)' }} />
      }
      <span style={{ fontSize: 11, fontWeight: 700, color: isPositive ? 'var(--color-emerald)' : 'var(--color-error)' }}>
        {change > 0 ? '+' : ''}{change}%
      </span>
      <span className="label-tiny" style={{ color: 'var(--color-muted)' }}>vs last month</span>
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { summary, fetchSummary, loading } = useFinanceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    console.log('[Dashboard] Fetching summary, role:', user?.role);
    fetchSummary();
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Skeleton loading state ────────────────────────────────────────────
  if (loading && !summary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Skeleton header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 120, height: 10, background: 'var(--color-surface)', borderRadius: 4 }} />
            <div style={{ width: 220, height: 32, background: 'var(--color-surface)', borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{ padding: 24, height: 120,
              background: 'linear-gradient(90deg, var(--color-surface) 25%, rgba(255,255,255,0.02) 50%, var(--color-surface) 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
            }} />
          ))}
        </div>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────
  if (!summary) {
    return (
      <div className="page-fade">
        <Header today={today} onRefresh={fetchSummary} loading={loading} />
        <div className="card" style={{ padding: 64, textAlign: 'center', marginTop: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(16,185,129,0.4)',
          }}>
            <FileText size={24} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>
            No financial data yet
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 24 }}>
            Add your first financial record to see analytics here.
          </p>
          <Link to="/records" className="btn btn-em" style={{ display: 'inline-flex' }}>
            Go to Records
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 32 }}>
      <Header today={today} onRefresh={fetchSummary} loading={loading} />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <SummaryCard title="Total Income"   value={summary.totalIncome}   Icon={TrendingUp}   change={12.5} isPositive={true}  />
        <SummaryCard title="Total Expenses" value={summary.totalExpenses} Icon={TrendingDown} change={4.2}  isPositive={false} />
        <SummaryCard title="Net Balance"    value={summary.netBalance}    Icon={Wallet}       change={8.3}  isPositive={summary.netBalance >= 0} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

        {/* Area chart — monthly trends */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text)', marginBottom: 4 }}>Monthly Trends</div>
              <div className="label-tiny" style={{ color: 'var(--color-muted)' }}>Income vs Expenses over time</div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[['Income','var(--color-emerald)'],['Expenses','var(--color-error)']].map(([l, c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'block' }} />
                  <span className="label-tiny" style={{ color: 'var(--color-muted)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.monthlyTrends || []}>
                <defs>
                  <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="income"  
                  name="Income"  
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  fill="url(#gIncome)"  
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationBegin={400}
                  animationEasing="ease-in-out"
                  activeDot={{ r: 5, fill: '#10B981', stroke: 'var(--color-bg)', strokeWidth: 2 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expenses" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  strokeDasharray="5 4" 
                  fill="url(#gExpense)" 
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationBegin={400}
                  animationEasing="ease-in-out"
                  activeDot={{ r: 5, fill: '#EF4444', stroke: 'var(--color-bg)', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart — category breakdown */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text)', marginBottom: 4 }}>Category Breakdown</div>
            <div className="label-tiny" style={{ color: 'var(--color-muted)' }}>Spending by category</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.categoryTotals || []} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CatTooltip />} cursor={{ fill: 'rgba(16,185,129,0.03)' }} />
                <Bar 
                  dataKey="total" 
                  radius={[0, 4, 4, 0]} 
                  barSize={14}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationBegin={500}
                  animationEasing="ease-out"
                >
                  {(summary.categoryTotals || []).map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.75} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(summary.categoryTotals || []).slice(0, 4).map((cat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: BAR_COLORS[i % BAR_COLORS.length], display: 'block', flexShrink: 0 }} />
                  <span className="label-tiny" style={{ color: 'var(--color-muted)' }}>{cat.category}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text)' }}>
                  ₹{Number(cat.total).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow for activity section */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 200, height: 200,
          background: 'rgba(16,185,129,0.03)', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-text)', marginBottom: 4 }}>Recent Transactions</div>
            <div className="label-tiny" style={{ color: 'var(--color-muted)' }}>Latest activity across all accounts</div>
          </div>
          <Link to="/records" className="label-tiny btn-ghost" style={{ color: 'var(--color-emerald)', textDecoration: 'none', fontWeight: 800 }}>
            VIEW ALL RECORDS
          </Link>
        </div>

        <div style={{ overflowX: 'auto', position: 'relative', zIndex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px' }} className="label-tiny">DATE</th>
                <th style={{ textAlign: 'left', padding: '12px 16px' }} className="label-tiny">DESCRIPTION</th>
                <th style={{ textAlign: 'left', padding: '12px 16px' }} className="label-tiny">CATEGORY</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }} className="label-tiny">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {(summary.recentActivity || []).map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '14px 16px', fontSize: 11, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: 'rgba(255,255,255,0.03)', color: 'var(--color-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '14px 16px', textAlign: 'right', fontSize: 13, fontWeight: 800,
                    color: item.type === 'Income' ? 'var(--color-emerald)' : 'var(--color-text)'
                  }}>
                    {item.type === 'Income' ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
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

// ── Page header (shared) ──────────────────────────────────────────────────
const Header = ({ today, onRefresh, loading }) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', gap: 16,
    justifyContent: 'space-between', alignItems: 'flex-end',
    paddingBottom: 24, borderBottom: '1px solid var(--color-border)',
  }}>
    <div>
      <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 8 }}>
        DASHBOARD // ANALYTICS
      </div>
      <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 8 }}>
        Finance Overview
      </h2>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        padding: '6px 14px', background: 'var(--color-surface)',
        border: '1px solid var(--color-border)', borderRadius: 4,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Calendar size={12} style={{ color: 'var(--color-muted)' }} />
        <span className="font-mono-ui" style={{ fontSize: 11, color: 'var(--color-muted)' }}>{today}</span>
      </div>
      <button
        onClick={onRefresh}
        className="btn btn-ghost"
        style={{ height: 36, width: 36, padding: 0 }}
        title="Refresh data"
      >
        <RefreshCw size={14} style={{ transition: 'transform 400ms', transform: loading ? 'rotate(360deg)' : 'none' }} />
      </button>
    </div>
  </div>
);

export default Dashboard;
