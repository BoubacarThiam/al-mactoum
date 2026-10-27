'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';

interface HeroVideoProps {
  t: Dictionary['hero']['video'];
}

/**
 * Vidéo de présentation affichée dans le hero.
 * Lecture automatique sans son, en boucle, uniquement quand elle est visible à l'écran.
 * Pas de lecture automatique si le visiteur a demandé à réduire les animations.
 * Fichiers : /public/videos/al-mactoum-intro.mp4 (+ image d'aperçu -poster.jpg).
 */
export function HeroVideo({ t }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // Mis à true quand le visiteur met en pause lui-même : on ne relance plus automatiquement
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    }
  }

  const controlClass =
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy-950/60 text-white backdrop-blur-md transition hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold';

  return (
    <figure className="relative">
      {/* Halo doré derrière le cadre */}
      <div
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-gold/20 opacity-60 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-navy-950 shadow-lift ring-1 ring-white/10">
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          poster="/videos/al-mactoum-intro-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={t.label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/videos/al-mactoum-intro.mp4" type="video/mp4" />
        </video>

        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className={controlClass}
            aria-label={playing ? t.pause : t.play}
          >
            {playing ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className={controlClass}
            aria-label={muted ? t.unmute : t.mute}
            aria-pressed={!muted}
          >
            {muted ? (
              <VolumeX className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-300">{t.caption}</figcaption>
    </figure>
  );
}
