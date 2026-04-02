import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Terminal, Shield, Database, Activity, 
  Lock, Server, Zap, Layers, Globe, Code
} from 'lucide-react';

const ApiDocs = () => {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text)', paddingBottom: 80 }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)', height: 64,
        display: 'flex', alignItems: 'center'
      }}>
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/landing" className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, borderRadius: 4 }}>
              <ArrowLeft size={16} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={18} color="var(--color-emerald)" />
              <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>API_DOCUMENTATION_V1</span>
            </div>
          </div>
          <Link to="/landing" className="label-caps font-mono-ui" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontSize: 10 }}>
            Back to Landing
          </Link>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="page-wrap" style={{ marginTop: 64 }}>
        
        {/* Hero Section */}
        <section style={{ marginBottom: 80 }}>
          <div className="badge badge-em font-mono-ui" style={{ marginBottom: 16 }}>SYSTEM_OVERVIEW</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 24 }}>
            Integrate with <span style={{ color: 'var(--color-emerald)' }}>Zorvyn Finance</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-muted)', maxWidth: 600, lineHeight: 1.6 }}>
            Comprehensive documentation for the Zorvyn Finance API. 
            All endpoints are protected by role-based access control (RBAC) and require JWT authorization unless specified otherwise.
          </p>
        </section>

        {/* Tech Stack */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Code size={20} color="var(--color-emerald)" /> Technology Foundation
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { title: 'Core Runtime', value: 'Node.js 20+ with Express 5 framework for low-latency request processing.', Icon: Server },
              { title: 'Identity', value: 'JWT (JSON Web Tokens) with 24h expiration and Google OAuth 2.0 integration.', Icon: Shield },
              { title: 'Persistence', value: 'MySQL 8 on Aiven Cloud with SSL/TLS encryption and connection pooling.', Icon: Database },
              { title: 'Security', value: 'Bcrypt password hashing, Joi schema validation, and rate limiting (Express Rate Limit).', Icon: Lock },
              { title: 'Frontend', value: 'React 19, Vite, Tailwind CSS v4, and Lucide React for a premium industrial UI.', Icon: Layers },
              { title: 'Infrastructure', value: 'Render for backend deployment and Vercel for frontend hosting.', Icon: Globe }
            ].map((tech, idx) => (
              <div key={idx} className="card" style={{ padding: 24, display: 'flex', gap: 16 }}>
                <div style={{ color: 'var(--color-emerald)', marginTop: 4 }}><tech.Icon size={20} strokeWidth={1.5} /></div>
                <div>
                  <div className="label-caps" style={{ fontSize: 11, marginBottom: 8, color: 'var(--color-emerald)' }}>{tech.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 }}>{tech.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Terminal size={20} color="var(--color-emerald)" /> REST Endpoints
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {/* Auth Service */}
            <div>
              <div className="badge badge-muted font-mono-ui" style={{ marginBottom: 20 }}>AUTH_SERVICE</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <EndpointCard 
                  method="POST" 
                  path="/auth/register" 
                  desc="Create a new user account and trigger OTP email."
                  body='{ "username", "email", "password", "role_name" }'
                  roles="Public"
                />
                <EndpointCard 
                  method="POST" 
                  path="/auth/verify-otp" 
                  desc="Verify account ownership using 6-digit email code."
                  body='{ "email", "otp" }'
                  roles="Public"
                />
                <EndpointCard 
                  method="POST" 
                  path="/auth/login" 
                  desc="Authenticate credentials and receive JWT bearer token."
                  body='{ "email", "password" }'
                  roles="Public"
                />
                <EndpointCard 
                  method="GET" 
                  path="/auth/google" 
                  desc="Initiates Google OAuth2 handshake (Redirects)."
                  roles="Public"
                />
              </div>
            </div>

            {/* Records Service */}
            <div>
              <div className="badge badge-muted font-mono-ui" style={{ marginBottom: 20 }}>RECORDS_SERVICE</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <EndpointCard 
                  method="GET" 
                  path="/records" 
                  desc="Fetch financial records for the user's organization."
                  roles="Viewer, Analyst, Admin"
                />
                <EndpointCard 
                  method="POST" 
                  path="/records" 
                  desc="Capture new income/expense entry."
                  body='{ "amount", "type", "category", "date", "description" }'
                  roles="Admin Only"
                />
                <EndpointCard 
                  method="PUT" 
                  path="/records/:id" 
                  desc="Update existing record parameters."
                  roles="Admin Only"
                />
                <EndpointCard 
                  method="DELETE" 
                  path="/records/:id" 
                  desc="Permanently remove financial record."
                  roles="Admin Only"
                />
              </div>
            </div>

            {/* Dashboard Service */}
            <div>
              <div className="badge badge-muted font-mono-ui" style={{ marginBottom: 20 }}>ANALYTICS_SERVICE</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <EndpointCard 
                  method="GET" 
                  path="/dashboard/summary" 
                  desc="Aggregated financial metrics and monthly trends."
                  roles="Analyst, Admin"
                />
                <EndpointCard 
                  method="GET" 
                  path="/dashboard/activity" 
                  desc="Recent audit trail and record history stream."
                  roles="Analyst, Admin"
                />
              </div>
            </div>

            {/* Admin Service */}
            <div>
              <div className="badge badge-muted font-mono-ui" style={{ marginBottom: 20 }}>ADMIN_SERVICE</div>
              <div style={{ display: 'grid', gap: 16 }}>
                <EndpointCard 
                  method="GET" 
                  path="/admin/logs" 
                  desc="Historical audit logs for organization governance."
                  roles="Admin Only"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section style={{ marginTop: 100, textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 80 }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Ready to Build?</h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: 32 }}>Access the portal to start managing your organization's data.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/landing" className="btn btn-ghost">Return to Home</Link>
            <Link to="/login" className="btn btn-primary">Sign In to Dashboard</Link>
          </div>
        </section>

      </main>
    </div>
  );
};

const EndpointCard = ({ method, path, desc, body, roles }) => (
  <div className="card" style={{ padding: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ 
          padding: '4px 8px', borderRadius: 4, 
          background: method === 'GET' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
          color: method === 'GET' ? 'var(--color-emerald)' : '#ef4444', 
          fontSize: 10, fontWeight: 900 
        }}>{method}</span>
        <code style={{ fontSize: 13, color: 'var(--color-text)', background: 'transparent', padding: 0 }}>{path}</code>
      </div>
      <span className="label-tiny" style={{ opacity: 0.5 }}>{roles}</span>
    </div>
    <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: body ? 16 : 0 }}>{desc}</p>
    {body && (
      <div style={{ background: '#0c121e', padding: 12, borderRadius: 4, border: '1px solid var(--color-border)' }}>
        <div className="label-tiny" style={{ opacity: 0.4, marginBottom: 8 }}>PAYLOAD_SCHEMA</div>
        <code style={{ fontSize: 12, color: 'var(--color-emerald)', background: 'transparent', padding: 0 }}>{body}</code>
      </div>
    )}
  </div>
);

export default ApiDocs;
