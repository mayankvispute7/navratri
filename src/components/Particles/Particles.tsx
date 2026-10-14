import { useEffect, useRef } from 'react';
import './Particles.css';

interface ParticlesProps {
  /** Number of particles */
  count?: number;
  /** 'warm' for opening, 'crimson' for proposal */
  variant?: 'warm' | 'crimson';
}

export default function Particles({ count = 15, variant = 'warm' }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduce particles on mobile / low-power
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // Reduce count on small screens
    const isMobile = window.innerWidth < 768;
    const actualCount = isMobile ? Math.max(5, Math.floor(count / 2)) : count;

    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < actualCount; i++) {
      const particle = document.createElement('div');
      particle.className = `particle particle--${variant}`;

      // Randomize position, size, delay, and duration
      const size = 3 + Math.random() * 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = 4 + Math.random() * 6;
      const startY = 60 + Math.random() * 40;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${startY}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, [count, variant]);

  return (
    <div
      ref={containerRef}
      className="particles-container"
      aria-hidden="true"
    />
  );
}
