import React, { useEffect, useRef } from 'react';

const InteractiveGlow = () => {
    const glowRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (glowRef.current) {
                glowRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
                glowRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div 
            ref={glowRef}
            className="glow-overlay" 
            aria-hidden="true" 
        />
    );
};

export default InteractiveGlow;
