import { useEffect, useState } from 'react';
import Particles from '../../components/Particles/Particles';
import './OpeningSection.css';

export default function OpeningSection() {
  const [revealed, setRevealed] = useState(false);
  const [imgError, setImgError] = useState({ devi: false, greeting: false });

  useEffect(() => {
    // Trigger reveal animation after mount
    const timer = requestAnimationFrame(() => {
      setRevealed(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <section
      id="opening"
      className="opening-section"
      aria-label="Happy Navratri greeting"
    >
      <Particles count={12} variant="warm" />

      <div className="opening-section__content">
        {/* Devi Maa illustration */}
        <div className={`opening-section__devi ${revealed ? 'opening-section__devi--visible' : ''}`}>
          {!imgError.devi ? (
            <img
              src="/assest/image/devimaa.png"
              alt="Devi Maa — Navratri illustration"
              className="opening-section__devi-img"
              loading="eager"
              onError={() => setImgError((prev) => ({ ...prev, devi: true }))}
            />
          ) : (
            <div className="opening-section__placeholder" role="img" aria-label="Devi Maa illustration">
              <span>🙏</span>
              <p>Devi Maa</p>
            </div>
          )}
        </div>

        {/* Happy Navratri greeting */}
        <div className={`opening-section__greeting ${revealed ? 'opening-section__greeting--visible' : ''}`}>
          {!imgError.greeting ? (
            <img
              src="/assest/image/happynavtri.png"
              alt="Happy Navratri"
              className="opening-section__greeting-img"
              loading="eager"
              onError={() => setImgError((prev) => ({ ...prev, greeting: true }))}
            />
          ) : (
            <div className="opening-section__placeholder opening-section__placeholder--text" role="img" aria-label="Happy Navratri">
              <h2>Happy Navratri 🪔</h2>
            </div>
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="opening-section__scroll-cue" aria-hidden="true">
        <div className="opening-section__scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
