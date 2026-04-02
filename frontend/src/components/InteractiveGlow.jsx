import React, { useEffect, useRef } from 'react';

/**
 * A lightweight, high-performance interactive background that tracks
 * mouse movement to create a radial glow effect.
 */
const InteractiveGlow = () => {
    const bgRef = useRef(null);

    useEffect(() => {
        let rafId;

        const handleMouseMove = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = e.clientX;
                const y = e.clientY;
                document.documentElement.style.setProperty('--mouse-x', `${x}px`);
                document.documentElement.style.setProperty('--mouse-y', `${y}px`);
            });
        };

        const hasMouse = window.matchMedia('(pointer: fine)').matches;

        if (hasMouse) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div 
            ref={bgRef}
            className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-900"
            aria-hidden="true"
        >
            {/* Main Interactive Glow */}
            <div 
                className="absolute inset-0 opacity-[0.06] transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #20C873, transparent 40%)`
                }}
            />
            
            {/* Ambient Secondary Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-green/5 blur-[120px] rounded-full animate-drift opacity-30" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-green/5 blur-[150px] rounded-full opacity-20" />
            
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
    );
};

export default InteractiveGlow;
