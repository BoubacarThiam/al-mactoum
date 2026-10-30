'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';

interface HeroVideoProps {
  t: Dictionary['hero']['video'];
}

/**
 * Vidéo de fond du hero (plein cadre, sans son, en boucle).
 * Lecture uniquement quand elle est visible à l'écran, et jamais automatique
 * si le visiteur a demandé à réduire les animations (l'image d'aperçu reste alors affichée).
 * Fichiers : /public/videos/al-mactoum-intro.mp4 (+ image d'aperçu -poster.jpg).
 * Sur téléphone, le cadrage est décalé à droite pour garder le globe visible.
 */
export function HeroVideo({ t }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
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
      { threshold: 0.1 },
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

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] md:object-center"
        poster="/videos/al-mactoum-intro-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/videos/al-mactoum-intro.mp4" type="video/mp4" />
      </video>

      {/* Bouton pause : toute animation de plus de 5 s doit pouvoir être arrêtée */}
      <button
        type="button"
        onClick={togglePlay}
        className="absolute bottom-28 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-ink-950/60 text-white backdrop-blur-md transition hover:border-mint hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint md:bottom-44 md:right-8"
        aria-label={playing ? t.pause : t.play}
      >
        {playing ? (
          <Pause className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Play className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
