import { useEffect, useRef, useState } from "react";
import poster from "../assets/movie/poster.webp";
import movie1080 from "../assets/movie/aftermovie-1080.mp4";
import movie720 from "../assets/movie/aftermovie-720.mp4";

/**
 * The aftermovie. Nothing but the poster loads until someone presses play;
 * then we pick the 720p file for small screens or data-saver, 1080p otherwise.
 */
function pickSource() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? "");
  const pixels = window.innerWidth * (window.devicePixelRatio || 1);
  return !slow && pixels >= 1400 ? movie1080 : movie720;
}

export function Movie() {
  const [src, setSrc] = useState<string | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src || !video.current) return;
    video.current.focus();
    video.current.play().catch(() => {
      /* Autoplay refused: the native controls are visible, so a second tap plays it. */
    });
  }, [src]);

  return (
    <div className="movie movie--live">
      {src ? (
        <video
          ref={video}
          className="movie__video"
          src={src}
          poster={poster}
          controls
          playsInline
          preload="auto"
          aria-label="Aftermovie Demo Day"
        />
      ) : (
        <button type="button" className="movie__start" aria-label="Speel de aftermovie af (1 minuut 38)" onClick={() => setSrc(pickSource())}>
          <img className="movie__poster" src={poster} alt="" loading="lazy" decoding="async" />
          <span className="movie__overlay">
            <span className="movie__play" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="movie__label">BEKIJK DE AFTERMOVIE · 1:38</span>
          </span>
        </button>
      )}
    </div>
  );
}
