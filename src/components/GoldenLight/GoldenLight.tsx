import { useEffect, useState } from 'react';
import './GoldenLight.css';

interface GoldenLightProps {
  active: boolean;
  onComplete?: () => void;
}

export default function GoldenLight({ active, onComplete }: GoldenLightProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 100 : 2000;

    const timer = setTimeout(() => {
      setFading(true);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      className={`golden-light ${!fading ? 'golden-light--active' : 'golden-light--fading'}`}
      aria-hidden="true"
    >
      <div className="golden-light__sweep" />
      <div className="golden-light__glow" />
    </div>
  );
}
