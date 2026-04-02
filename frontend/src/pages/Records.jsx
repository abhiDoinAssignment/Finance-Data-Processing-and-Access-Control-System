import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Trash2, Edit2, X,
  ArrowUpRight, ArrowDownRight, ChevronDown, Lock,
} from 'lucide-react';
import useFinanceStore from '../store/financeStore';
import useAuthStore    from '../store/authStore';

const CATEGORIES = ['Salary','Dividends','Rent','Food','Transport','Investments','Miscellaneous'];

// ── Add/Edit Record Modal ─────────────────────────────────────────────────
const RecordModal = ({ onClose, onSave, editData }) => {
  const isEdit = !!editData;
  const [form, setForm] = useState(editData || {
    amount: '', type: 'Income', category: 'Salary',
    date: new Date().toISOString().split('T')[0], description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await onSave({ ...form, amount: parseFloat(form.amount) });
    if (result?.success === false) {
      setError(result.message || 'Failed to save record.');
      setLoading(false);
    } else {
      onClose();
    }
  };

  // Close on Esc
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content card" style={{ padding: 36 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 6 }}>
              {isEdit ? 'EDIT RECORD' : 'NEW RECORD'}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              {isEdit ? 'Update transaction' : 'Add transaction'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Type toggle */}
          <div>
            <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>TYPE</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Income','Expense'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(p => ({ ...p, type: t }))}
                  style={{
                    flex: 1, height: 40, border: 'none', borderRadius: 4, cursor: 'pointer',
                    fontWeight: 800, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'background 150ms ease, color 150ms ease',
                    background: form.type === t
                      ? t === 'Income' ? 'var(--color-emerald)' : 'var(--color-error)'
                      : 'rgba(255,255,255,0.03)',
                    color: form.type === t ? '#fff' : 'var(--color-muted)',
                    border: `1px solid ${form.type === t
                      ? t === 'Income' ? 'var(--color-emerald)' : 'var(--color-error)'
                      : 'var(--color-border)'}`,
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>AMOUNT (₹)</label>
              <input type="number" className="input" placeholder="0.00" required min="0.01" step="0.01"
                value={form.amount} onChange={set('amount')} />
            </div>
            <div>
              <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>DATE</label>
              <input type="date" className="input" required value={form.date} onChange={set('date')} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>CATEGORY</label>
            <div style={{ position: 'relative' }}>
              <select className="input" style={{ paddingRight: 40 }} value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label-tiny" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>DESCRIPTION</label>
            <textarea className="input" placeholder="Short note about this transaction…" rows={3}
              value={form.description} onChange={set('description')} />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 4, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-error)' }}>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, height: 46 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, height: 46 }}>
              {loading ? 'Saving…' : isEdit ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Records Page ──────────────────────────────────────────────────────────
const Records = () => {
  const { records, fetchRecords, addRecord, updateRecord, deleteRecord, loading } = useFinanceStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  const [search,    setSearch]    = useState('');
  const [typeFilter,setTypeFilter]= useState('All');
  const [modal,     setModal]     = useState(null); // null | 'add' | { record }
  const [confirm,   setConfirm]   = useState(null); // record id to delete

  useEffect(() => {
    console.log('[Records] Fetching records, role:', user?.role);
    fetchRecords();
  }, []);

  const filtered = records.filter(r => {
    const matchSearch = r.category.toLowerCase().includes(search.toLowerCase())
      || r.description?.toLowerCase().includes(search.toLowerCase())
      || r.username?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleSave = async (data) => {
    console.log('[Records] Saving record:', data);
    if (modal?.record) {
      return await updateRecord(modal.record.id, data);
    }
    return await addRecord(data);
  };

  const handleDeleteConfirm = async () => {
    console.log('[Records] Deleting record id:', confirm);
    await deleteRecord(confirm);
    setConfirm(null);
  };

  // ── Mobile card view ────────────────────────────────────────────────
  const MobileCards = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filtered.map(r => (
        <div key={r.id} className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <span className="font-mono-ui" style={{ fontSize: 11, color: 'var(--color-muted)' }}>
              {new Date(r.date).toLocaleDateString('en-IN')}
            </span>
            <span className={`badge ${r.type === 'Income' ? 'badge-em' : 'badge-red'}`}>
              {r.type === 'Income' ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
              {r.type.toUpperCase()}
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', marginBottom: 4 }}>
            {r.description || r.category}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: r.type === 'Income' ? 'var(--color-emerald)' : 'var(--color-error)', marginBottom: 10 }}>
            {r.type === 'Expense' ? '-' : '+'}₹{Number(r.amount).toLocaleString()}
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModal({ record: r })} className="btn btn-ghost" style={{ height: 36, flex: 1, fontSize: 9 }}>
                <Edit2 size={12} /> Edit
              </button>
              <button onClick={() => setConfirm(r.id)} className="btn btn-danger" style={{ height: 36, flex: 1, fontSize: 9 }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 16,
        justifyContent: 'space-between', alignItems: 'flex-end',
        paddingBottom: 24, borderBottom: '1px solid var(--color-border)',
      }}>
        <div>
          <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 8 }}>
            TRANSACTIONS // SECURE DATABASE
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Financial Records
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge badge-muted">{records.length} total records</span>
            <span className="badge badge-muted">Role: {user?.role}</span>
          </div>
        </div>
        {isAdmin && (
          <button onClick={() => setModal('add')} className="btn btn-primary">
            <Plus size={15} /> Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} className="icon-left" />
          <input className="input" placeholder="Search category, description, owner…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ position: 'relative', minWidth: 150 }}>
          <select className="input" style={{ paddingRight: 36 }}
            value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      <>
        {/* Desktop table */}
        <div className="card" id="records-table" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)', fontSize: 13 }}>
                      No records match your filters.
                    </td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span className="font-mono-ui" style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                        {new Date(r.date).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {r.category}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-muted)', maxWidth: 200 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {r.description || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--color-muted)' }}>{r.username || '—'}</td>
                    <td>
                      <span className={`badge ${r.type === 'Income' ? 'badge-em' : 'badge-red'}`}>
                        {r.type === 'Income' ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                        {r.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{
                      textAlign: 'right', fontWeight: 900, fontSize: 13,
                      color: r.type === 'Income' ? 'var(--color-emerald)' : 'var(--color-error)',
                    }}>
                      {r.type === 'Expense' ? '-' : '+'}₹{Number(r.amount).toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                          <button onClick={() => setModal({ record: r })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 6, minWidth: 32, minHeight: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 150ms' }}
                            onMouseEnter={e=>e.currentTarget.style.color='var(--color-blue)'}
                            onMouseLeave={e=>e.currentTarget.style.color='var(--color-muted)'}
                            title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setConfirm(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 6, minWidth: 32, minHeight: 32, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 150ms' }}
                            onMouseEnter={e=>e.currentTarget.style.color='var(--color-error)'}
                            onMouseLeave={e=>e.currentTarget.style.color='var(--color-muted)'}
                            title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                    {!isAdmin && (
                      <td style={{ textAlign: 'center' }}>
                        <Lock size={12} style={{ color: 'rgba(100,116,139,0.3)' }} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards — hidden on desktop via inline style + media */}
        <div id="records-mobile" style={{ display: 'none' }}>
          {filtered.length === 0
            ? <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 32, fontSize: 13 }}>No records match your filters.</p>
            : <MobileCards />
          }
        </div>
        <style>{`
          @media (max-width: 640px) {
            #records-table  { display: none; }
            #records-mobile { display: block !important; }
          }
        `}</style>
      </>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal?.record) && (
        <RecordModal
          onClose={() => setModal(null)}
          onSave={handleSave}
          editData={modal?.record || null}
        />
      )}

      {/* Delete confirmation */}
      {confirm && (
        <div className="modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="card modal-content" style={{ padding: 32, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <Trash2 size={28} style={{ color: 'var(--color-error)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>Delete Record?</h3>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 28 }}>
              This action cannot be undone. The record will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirm(null)} className="btn btn-ghost" style={{ flex: 1, height: 44 }}>Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger" style={{ flex: 1, height: 44, fontWeight: 800, fontSize: 11 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
