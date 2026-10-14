import { useCallback, useRef, useState } from 'react';
import './GarbaFinale.css';

export default function GarbaFinale() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleError = useCallback(() => {
    console.warn('[GarbaFinale] Failed to load garba.mp4');
    setVideoError(true);
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  return (
    <section
      id="garba-finale"
      className="garba-finale"
      aria-label="Garba dance celebration"
    >
      <div className="garba-finale__container">
        {!videoError ? (
          <>
            <video
              ref={videoRef}
              className="garba-finale__video"
              src="/assest/video/garbaboygirl.mp4"
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              onError={handleError}
              aria-label="Boy and girl dancing Garba together"
            />

            {/* Sound toggle */}
            <button
              className="garba-finale__sound-toggle"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </>
        ) : (
          <div className="garba-finale__fallback">
            <span className="garba-finale__fallback-emoji">💃🕺</span>
            <p>Dancing together!</p>
          </div>
        )}
      </div>

      {/* Closing line */}
      <p className="garba-finale__closing">
        Jai Mata Di! 🙏 Happy Navratri! 🪔
      </p>
    </section>
  );
}
