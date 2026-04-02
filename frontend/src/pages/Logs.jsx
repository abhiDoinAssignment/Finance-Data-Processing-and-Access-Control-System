import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Search, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';

// ── Action badge colour logic ─────────────────────────────────────────────
const getActionBadge = (action = '') => {
  if (action.startsWith('USER_') || action.startsWith('RECORD_') === false && action.startsWith('USER'))
    return 'badge-blue';
  if (action.includes('DELETE'))
    return 'badge-red';
  if (action.startsWith('RECORD_'))
    return 'badge-em';
  return 'badge-muted';
};

// ── Logs Page ─────────────────────────────────────────────────────────────
const Logs = () => {
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [expanded,   setExpanded]   = useState(null); // log id

  const fetchLogs = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log('[Logs] Fetching audit logs…');
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Logs] Fetched', res.data.length, 'log entries');
      setLogs(res.data);
    } catch (err) {
      console.error('[Logs] Fetch failed:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.toLowerCase().includes(search.toLowerCase()) ||
    l.request_path?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id);
    console.log('[Logs] Toggled detail row for log id:', id);
  };

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
            FORENSICS // AUDIT TRAIL
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Audit Logs
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge badge-em" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-emerald)', display: 'block' }} />
              Live Stream Active
            </span>
            <span className="badge badge-muted">{logs.length} entries</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="input-icon-wrap" style={{ minWidth: 240 }}>
            <Search size={14} className="icon-left" />
            <input className="input" placeholder="Search action, user, path…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={fetchLogs} className="btn btn-ghost"
            disabled={loading} style={{ height: 44, width: 44, padding: 0 }} title="Refresh">
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)', fontSize: 13 }}>
            Loading audit entries…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)', fontSize: 13 }}>
            No entries match your search.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Path</th>
                  <th>IP</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <React.Fragment key={log.id}>
                    <tr style={{ borderLeft: expanded === log.id ? '2px solid var(--color-emerald)' : '2px solid transparent', transition: 'border-color 150ms' }}>
                      {/* Timestamp */}
                      <td>
                        <span className="font-mono-ui" style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                          {new Date(log.created_at).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* User */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: 4, flexShrink: 0,
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 900, color: 'var(--color-emerald)',
                          }}>
                            {(log.user || 'S').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)' }}>
                            {log.user || 'system'}
                          </span>
                        </div>
                      </td>

                      {/* Action badge */}
                      <td>
                        <span className={`badge ${getActionBadge(log.action)}`} style={{ fontFamily: 'Fira Code, monospace' }}>
                          {log.action?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Path */}
                      <td>
                        <span className="font-mono-ui" style={{ fontSize: 10, color: 'var(--color-muted)' }}>
                          {log.request_path || '—'}
                        </span>
                      </td>

                      {/* IP */}
                      <td>
                        <span className="font-mono-ui" style={{ fontSize: 10, color: 'var(--color-muted)' }}>
                          {log.ip_address || '—'}
                        </span>
                      </td>

                      {/* Expand toggle */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="btn btn-ghost label-caps"
                          style={{
                            height: 30, padding: '0 12px', fontSize: 9,
                            background: expanded === log.id ? 'var(--color-emerald-dim)' : 'transparent',
                            color: expanded === log.id ? 'var(--color-emerald)' : 'var(--color-muted)',
                            borderColor: expanded === log.id ? 'rgba(16,185,129,0.3)' : 'var(--color-border)',
                          }}
                        >
                          {expanded === log.id ? <EyeOff size={11} /> : <Eye size={11} />}
                          {expanded === log.id ? 'HIDE' : 'VIEW'}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable detail row */}
                    {expanded === log.id && (
                      <tr>
                        <td colSpan={6} style={{ padding: 0, background: 'rgba(8,12,20,0.6)' }}>
                          <div style={{ padding: '20px 24px', borderLeft: '2px solid var(--color-emerald)' }}>
                            <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 12 }}>
                              PAYLOAD DETAILS // LOG ID: {log.id}
                            </div>
                            <pre style={{
                              fontFamily: 'Fira Code, monospace',
                              fontSize: 11, lineHeight: 1.7,
                              color: 'var(--color-emerald)',
                              background: 'var(--color-bg)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 4, padding: 16,
                              overflowX: 'auto', maxHeight: 280, overflowY: 'auto',
                            }}>
                              {JSON.stringify(
                                {
                                  id: log.id,
                                  action: log.action,
                                  user: log.user,
                                  ip_address: log.ip_address,
                                  request_path: log.request_path,
                                  user_agent: log.user_agent,
                                  details: log.details,
                                  created_at: log.created_at,
                                },
                                null, 2
                              )}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Logs;
