import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Shield, Terminal, Zap, Layers, Activity } from 'lucide-react';

const GithubIcon = ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
);

const LinkedinIcon = ({ size = 20, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const Landing = () => {
    return (
        <div className="relative isolate min-h-screen">
            {/* Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-mesh opacity-50" />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-slate-base/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-accent rounded-sm flex items-center justify-center font-black text-slate-base text-sm">
                            A
                        </div>
                        <span className="font-bold tracking-tighter text-white uppercase text-xs">Abhishek Saini</span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                        <a href="#stack" className="hover:text-emerald-accent transition-colors">Stack</a>
                        <a href="#system" className="hover:text-emerald-accent transition-colors">System</a>
                        <Link to="/login" className="text-white hover:text-emerald-accent transition-colors">Portal</Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="min-h-[85vh] flex flex-col justify-center px-6 py-20 relative">
                    <div className="max-w-7xl mx-auto w-full relative">
                        <div className="space-y-8 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-accent"></span>
                                </span>
                                <span className="text-[9px] font-mono font-bold text-emerald-accent tracking-[0.2em] uppercase">Assignment Portal Active</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                                Finance Data <br/>
                                <span className="text-emerald-accent">Access Control</span>
                            </h1>

                            <p className="text-lg leading-relaxed font-medium text-slate-400">
                                Engineered by <span className="text-white font-bold italic">Abhishek Saini</span>, Backend Developer Intern.
                                This portal showcases high-security API architectures designed for granular financial data management and rigorous RBAC protocols.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link to="/register" className="px-10 py-4 bg-white text-slate-base font-black rounded-sm hover:bg-emerald-accent transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest">
                                    Initialize Account
                                </Link>
                                <Link to="/login" className="px-10 py-4 border border-white/20 text-white font-black rounded-sm hover:bg-white/5 transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest">
                                    Secure Login
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
                            <Terminal size={400} strokeWidth={0.5} className="text-emerald-accent" />
                        </div>
                    </div>
                </section>

                {/* Core Specifications */}
                <section id="system" className="py-32 px-6 bg-slate-surface/30 border-y border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20">
                            <h2 className="text-[10px] font-mono font-bold text-emerald-accent tracking-[0.5em] uppercase mb-4">Functional Specifications</h2>
                            <h3 className="text-4xl font-black text-white tracking-tighter">Core System Requirements</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { id: '01', title: 'Identity & Access', desc: 'JWT-based auth with hierarchical RBAC (Admin, Member, Viewer).', icon: Shield },
                                { id: '02', title: 'Data Integrity', desc: 'Encrypted persistence for transaction records, ensuring ACID compliance.', icon: Layers },
                                { id: '03', title: 'Real-time Analytics', desc: 'Summary endpoints for live tracking and financial health reporting.', icon: Zap },
                                { id: '04', title: 'Secure Tunneling', desc: 'Precise middleware enforcement preventing unauthorized data leakage.', icon: Activity }
                            ].map((feature, i) => (
                                <div key={i} className="fine-border p-10 bg-slate-base/50 space-y-6 hover:border-emerald-accent/40 transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div className="text-emerald-accent text-2xl font-mono font-bold">{feature.id}</div>
                                        <feature.icon className="text-slate-700 group-hover:text-emerald-500 transition-colors" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white tracking-tight leading-snug">{feature.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technical Stack */}
                <section id="stack" className="py-32 px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/3">
                            <h2 className="text-[10px] font-mono font-bold text-emerald-accent tracking-[0.5em] uppercase mb-4">Architecture</h2>
                            <h3 className="text-4xl font-black text-white tracking-tighter mb-8">Built for Scalability</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Leveraging a robust ecosystem of automation and backend technologies to deliver high-accuracy financial processing with sub-ms response times.
                            </p>
                        </div>
                        <div className="lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                            {['MERN Stack', 'Docker', 'n8n Logic', 'Aiven Cloud', 'Kafka', 'React v19', 'JWT Sec', 'MySQL'].map((tech, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-8 bg-slate-surface/20 rounded-sm border border-white/5 grayscale hover:grayscale-0 hover:bg-slate-surface/40 transition-all cursor-default">
                                    <span className="text-emerald-accent font-black text-xs uppercase tracking-widest mb-1 italic">{tech}</span>
                                    <span className="text-[8px] text-slate-600 font-black tracking-tighter uppercase leading-none opacity-50">Enterprise Ready</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Status Section */}
                <section className="py-32 px-6 border-t border-white/5 bg-emerald-accent/[0.02]">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block p-12 bg-emerald-accent/5 rounded-full mb-10 border border-emerald-accent/10">
                            <Shield className="w-16 h-16 text-emerald-accent mx-auto" strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight mb-6 uppercase italic">Production Ready Deployment</h3>
                        <p className="text-slate-400 mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                            The backend architecture is currently optimized for low-latency requests and secure data tunneling. All endpoints are documented and ready for integration testing.
                        </p>
                        <div className="font-mono text-[10px] text-emerald-accent bg-emerald-accent/10 px-6 py-3 inline-block rounded-sm border border-emerald-accent/20 uppercase tracking-[0.2em] font-bold">
                            GIT_BRANCH: main // STATUS: optimized_secure
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-base py-16 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-[10px] text-slate-600 font-black tracking-widest uppercase opacity-70">
                        © 2026 Abhishek Saini. Assignment Context Only.
                    </div>
                    <div className="flex gap-10">
                        <a href="https://github.com/OMEGA-5656" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white flex items-center gap-3 transition-all group">
                            <GithubIcon size={20} className="group-hover:text-emerald-500" />
                            <span className="text-[10px] font-black tracking-widest uppercase">GitHub</span>
                        </a>
                        <a href="https://linkedin.com/in/abhisheksaini-dev" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white flex items-center gap-3 transition-all group">
                            <LinkedinIcon size={20} className="group-hover:text-emerald-500" />
                            <span className="text-[10px] font-black tracking-widest uppercase">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
