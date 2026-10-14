import { useEffect, useRef, useCallback, useState } from 'react';
import './VideoCharacter.css';

interface VideoCharacterProps {
  src: string;
  loop: boolean;
  /** Changing playKey forces a new load/play cycle */
  playKey: string;
  className?: string;
  ariaLabel: string;
  onEnded?: () => void;
  /** If true, pauses the video (e.g. when off-screen) */
  paused?: boolean;
}

export default function VideoCharacter({
  src,
  loop,
  playKey,
  className = '',
  ariaLabel,
  onEnded,
  paused = false,
}: VideoCharacterProps) {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Handle source changes via playKey
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    video.src = src;
    video.loop = loop;
    video.currentTime = 0;
    video.load();

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch((err) => {
        // Autoplay blocked — browser policy. Graceful degradation.
        if (err.name !== 'AbortError') {
          console.warn(`[VideoCharacter] Play blocked for ${src}:`, err.message);
        }
      });
    }
  }, [src, playKey, loop]);

  // Handle pause/resume for off-screen optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (paused) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Silently handle — already logged above
        });
      }
    }
  }, [paused]);

  // Handle 'ended' event for one-shot reaction clips
  const handleEnded = useCallback(() => {
    if (onEndedRef.current) {
      onEndedRef.current();
    }
  }, []);

  // Handle video error gracefully
  const handleError = useCallback(() => {
    console.warn(`[VideoCharacter] Failed to load video: ${src}`);
    setHasError(true);
  }, [src]);

  return (
    <div className={`video-character ${className}`}>
      <video
        ref={videoRef}
        className="video-character__video"
        muted
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        onEnded={handleEnded}
        onError={handleError}
        style={{ display: hasError ? 'none' : 'block' }}
      />
      {hasError && (
        <div className="video-character__fallback" aria-hidden="true">
          <span className="video-character__fallback-icon">🎭</span>
        </div>
      )}
    </div>
  );
}
