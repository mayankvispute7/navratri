import { useEffect, useState } from 'react';
import './IntroLoader.css';

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<'loading' | 'sweep' | 'done'>('loading');

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip animation, just show briefly and complete
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 100);
      return () => clearTimeout(timer);
    }

    // Brief warm hold, then golden sweep
    const holdTimer = setTimeout(() => {
      setPhase('sweep');
    }, 600);

    const completeTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`intro-loader ${phase === 'sweep' ? 'intro-loader--sweep' : ''}`}
      role="status"
      aria-label="Loading Navratri experience"
    >
      <div className="intro-loader__surface" />
      <div className="intro-loader__golden-sweep" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
