import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Terminal, Zap, Layers,
  Activity, Lock, Database, Server,
} from 'lucide-react';

// ── Inline SVG icons for GitHub / LinkedIn ────────────────────────────────
const GithubIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ── Sticky Navbar ─────────────────────────────────────────────────────────
const Navbar = () => (
  <nav style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    height: 64, display: 'flex', alignItems: 'center',
    background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--color-border)',
  }}>
    <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, background: 'var(--color-emerald)', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 16, color: '#fff',
        }}>Z</div>
        <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: '0.04em', color: 'var(--color-text)' }}>
          ZORVYN FINANCE
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#system" className="label-caps" style={{ color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 150ms' }}
          onMouseEnter={e => e.target.style.color='var(--color-text)'}
          onMouseLeave={e => e.target.style.color='var(--color-muted)'}
        >Architecture</a>
        <a href="#stack" className="label-caps" style={{ color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 150ms' }}
          onMouseEnter={e => e.target.style.color='var(--color-text)'}
          onMouseLeave={e => e.target.style.color='var(--color-muted)'}
        >Stack</a>
        <Link to="/docs" className="label-caps" style={{ color: 'var(--color-emerald)', textDecoration: 'none', transition: 'filter 150ms', filter: 'brightness(0.8)' }}
          onMouseEnter={e => e.currentTarget.style.filter='brightness(1.2)'}
          onMouseLeave={e => e.currentTarget.style.filter='brightness(0.8)'}
        >API Docs</Link>
        <Link to="/login" className="btn btn-ghost label-caps" style={{ height: 36, fontSize: 9, padding: '0 16px' }}>
          Access Portal
        </Link>
      </div>
    </div>
  </nav>
);

// ── Spec cards data ───────────────────────────────────────────────────────
const specs = [
  { id: '01', title: 'Identity Layer',   Icon: Shield,   desc: 'JWT authentication with local credentials and Google OAuth 2.0, backed by full OTP email verification.' },
  { id: '02', title: 'RBAC Engine',      Icon: Lock,     desc: 'Three-tier role system — Admin, Analyst, Viewer — with explicit permission checks on every API route.' },
  { id: '03', title: 'Finance Records',  Icon: Database, desc: 'Full CRUD for financial records with income/expense classification and category-level analytics.' },
  { id: '04', title: 'Audit Logging',    Icon: Activity, desc: 'Every significant action persisted with IP, user agent, and full JSON payload snapshot.' },
];

// ── Stack tiles ───────────────────────────────────────────────────────────
const stack = [
  { name: 'React 19',    Icon: Zap },
  { name: 'Node.js',     Icon: Server },
  { name: 'MySQL',       Icon: Database },
  { name: 'JWT',         Icon: Shield },
  { name: 'Tailwind v4', Icon: Layers },
  { name: 'Passport.js', Icon: Lock },
  { name: 'Recharts',    Icon: Activity },
  { name: 'Aiven Cloud', Icon: Server },
];

// ── Landing Page ─────────────────────────────────────────────────────────
const Landing = () => {
  console.log('[Landing] Rendering public landing page');

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', overflowX: 'hidden', color: 'var(--color-text)' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '85vh', display: 'flex', alignItems: 'center',
        paddingTop: 64, position: 'relative',
      }}>
        {/* Decorative Terminal icon */}
        <Terminal size={360} strokeWidth={0.4} style={{
          position: 'absolute', right: '-2%', top: '10%',
          color: 'var(--color-emerald)', opacity: 0.04, pointerEvents: 'none',
        }} />

        <div className="page-wrap" style={{ width: '100%', paddingBlock: 80 }}>
          {/* Pulsing badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 16px',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 100, marginBottom: 40,
          }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span className="animate-ping" style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'var(--color-emerald)', opacity: 0.5,
              }} />
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-emerald)', display: 'block', position: 'relative',
              }} />
            </span>
            <span className="font-mono-ui label-tiny" style={{ color: 'var(--color-emerald)', letterSpacing: '0.25em' }}>
              ASSIGNMENT PORTAL ACTIVE
            </span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900,
            lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 28,
            color: 'var(--color-text)',
          }}>
            Finance Data<br />
            <span style={{ color: 'var(--color-emerald)' }}>Access Control</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 17, color: 'var(--color-muted)', maxWidth: 520, lineHeight: 1.65, marginBottom: 48 }}>
            Enterprise-grade financial record management with granular RBAC, OTP-verified accounts,
            audit logging, and real-time analytics — built for the Zorvyn internship assessment.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 64 }}>
            <Link to="/register" className="btn btn-primary" style={{ gap: 10 }}>
              Get Started <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link to="/docs" className="btn btn-ghost" style={{ gap: 8, borderColor: 'rgba(16,185,129,0.2)' }}>
              <Terminal size={14} /> API Docs
            </Link>
          </div>

          {/* Author credit */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            paddingTop: 32, borderTop: '1px solid var(--color-border)',
          }}>
            <span className="label-tiny" style={{ color: 'var(--color-muted)' }}>BUILT BY</span>
            <span style={{
              padding: '4px 12px', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 4,
              fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--color-text)',
            }}>ABHISHEK SAINI</span>
            <span className="label-tiny" style={{ color: 'var(--color-muted)' }}>BACKEND DEVELOPER INTERN CANDIDATE</span>
          </div>
        </div>
      </section>

      {/* ── Core Specifications ───────────────────────────────────────────── */}
      <section id="system" style={{ paddingBlock: 96, borderTop: '1px solid var(--color-border)' }}>
        <div className="page-wrap">
          <div style={{ marginBottom: 56 }}>
            <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 12 }}>CORE SPECIFICATIONS</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
              System Architecture
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {specs.map(({ id, title, Icon, desc }) => (
              <div
                key={id}
                className="card card-hover"
                style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20, minHeight: 220 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="font-mono-ui" style={{ fontSize: 28, fontWeight: 500, color: 'rgba(16,185,129,0.25)', lineHeight: 1 }}>{id}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 4,
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-emerald)',
                  }}>
                    <Icon size={17} />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.04em', color: 'var(--color-text)', marginBottom: 8, textTransform: 'uppercase' }}>
                    {title}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────────── */}
      <section id="stack" style={{ paddingBlock: 96, borderTop: '1px solid var(--color-border)' }}>
        <div className="page-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 12 }}>STACK TRACE</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text)', marginBottom: 20 }}>
                Enterprise Foundation
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.7 }}>
                Modern web standards and high-reliability frameworks for secure, performant financial workflows.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {stack.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="card"
                  style={{
                    padding: '24px 12px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 12, cursor: 'default',
                    filter: 'grayscale(1)', opacity: 0.5,
                    transition: 'filter 200ms ease, opacity 200ms ease, border-color 200ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.filter='grayscale(0)'; e.currentTarget.style.opacity='1'; e.currentTarget.style.borderColor='rgba(16,185,129,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter='grayscale(1)'; e.currentTarget.style.opacity='0.5'; e.currentTarget.style.borderColor='var(--color-border)'; }}
                >
                  <Icon size={24} color="var(--color-emerald)" />
                  <span className="label-tiny" style={{ color: 'var(--color-text)', textAlign: 'center' }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / Status Section ─────────────────────────────────────────── */}
      <section style={{ paddingBlock: 80, borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div className="page-wrap">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', color: 'var(--color-emerald)',
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-text)', marginBottom: 16 }}>
            Secure. Auditable. Role-Driven.
          </h2>
          <div className="font-mono-ui badge badge-em" style={{ fontSize: 9, marginBottom: 36, display: 'inline-flex' }}>
            GIT_BRANCH: main // STATUS: optimized_secure
          </div>
          <br />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">Create Account <ArrowRight size={14} /></Link>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── About / Credits ──────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 80, borderTop: '1px solid var(--color-border)' }}>
        <div className="page-wrap">
          <div className="label-caps font-mono-ui" style={{ color: 'var(--color-emerald)', marginBottom: 12 }}>ABOUT</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-text)', marginBottom: 40 }}>
            Built with purpose.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 64 }}>
            <div>
              <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: 24 }}>
                This project demonstrates production-quality patterns for security-conscious backend development:
                role-based access control, JWT lifecycle management, OTP-verified email registration, and comprehensive
                audit logging. Every API route is protected with explicit permission checks and validated with Joi schemas.
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7 }}>
                Designed &amp; developed by <strong style={{ color: 'var(--color-text)' }}>Abhishek Saini</strong> — Backend Developer Intern candidate.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <a href="https://github.com/OMEGA-5656" target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:8, color:'var(--color-muted)', textDecoration:'none', fontSize:12, fontWeight:700, transition:'color 150ms' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--color-emerald)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--color-muted)'}
                >
                  <GithubIcon /> GitHub
                </a>
                <a href="https://linkedin.com/in/abhisheksaini-dev" target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:8, color:'var(--color-muted)', textDecoration:'none', fontSize:12, fontWeight:700, transition:'color 150ms' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--color-emerald)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--color-muted)'}
                >
                  <LinkedinIcon /> LinkedIn
                </a>
              </div>
            </div>
            <div>
              <div className="label-tiny" style={{ color: 'var(--color-muted)', marginBottom: 16 }}>TECHNOLOGIES USED</div>
              {['React 19 + Vite', 'Node.js + Express v5', 'MySQL 2 (Aiven Cloud)', 'JWT + Passport.js', 'Bcrypt + Joi', 'Resend Email API', 'Recharts', 'Zustand + Axios'].map(t => (
                <div key={t} style={{
                  padding: '8px 0', borderBottom: '1px solid var(--color-border)',
                  fontSize: 12, color: 'var(--color-muted)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(16,185,129,0.4)', flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <span className="font-mono-ui badge badge-muted" style={{ fontSize: 8, opacity: 0.5 }}>
              ACADEMIC ASSIGNMENT — NOT PRODUCTION DEPLOYMENT
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)', padding: '32px 0',
        background: 'rgba(8,12,20,0.5)',
      }}>
        <div className="page-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span className="font-mono-ui label-tiny" style={{ color: 'rgba(100,116,139,0.5)' }}>
            © 2026 ABHISHEK SAINI
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://github.com/OMEGA-5656" target="_blank" rel="noreferrer"
              style={{ color: 'var(--color-muted)', transition: 'color 150ms' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--color-text)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--color-muted)'}
            ><GithubIcon /></a>
            <a href="https://linkedin.com/in/abhisheksaini-dev" target="_blank" rel="noreferrer"
              style={{ color: 'var(--color-muted)', transition: 'color 150ms' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--color-text)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--color-muted)'}
            ><LinkedinIcon /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
