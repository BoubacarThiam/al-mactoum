'use client';

/** Outils du backoffice côté navigateur : enregistrement des listes et envoi des fichiers. */

import { upload } from '@vercel/blob/client';
import { MAX_VIDEO_BYTES, VIDEO_TYPES } from '@/lib/media-limits';

export type StorageMode = 'blob' | 'local' | null;
export type Notify = (type: 'ok' | 'error', text: string) => void;

/** Session expirée : retour à la page de connexion */
function toLogin(): never {
  window.location.href = '/admin/login/';
  throw new Error('Session expirée.');
}

async function readError(res: Response, fallback: string): Promise<string> {
  return (await res.json().catch(() => null))?.error ?? fallback;
}

/** Enregistre une liste complète et renvoie la version vérifiée par le serveur. */
export async function saveList<T>(collection: 'vehicles' | 'promos' | 'operations', items: T[]): Promise<T[]> {
  let res: Response;
  try {
    res = await fetch(`/api/admin/content/${collection}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
  } catch {
    throw new Error('Pas de connexion internet. Réessayez.');
  }
  if (res.status === 401) toLogin();
  if (!res.ok) throw new Error(await readError(res, "L'enregistrement a échoué."));
  return (await res.json()).items;
}

/** Envoie une photo ou une vidéo et renvoie son adresse. */
export async function uploadFile(
  file: Blob,
  folder: 'vehicules' | 'videos',
  storage: StorageMode,
  onProgress?: (percent: number) => void,
): Promise<string> {
  // En ligne, une vidéo part directement vers Vercel Blob (trop lourde pour le serveur)
  if (storage === 'blob' && VIDEO_TYPES.includes(file.type)) {
    const ext = file.type === 'video/quicktime' ? 'mov' : file.type === 'video/webm' ? 'webm' : 'mp4';
    try {
      const blob = await upload(`videos/video.${ext}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-upload/',
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => onProgress?.(percentage),
      });
      return blob.url;
    } catch (error) {
      if (error instanceof Error && /Session expirée/.test(error.message)) toLogin();
      throw new Error("La vidéo n'a pas pu être envoyée. Vérifiez la connexion et réessayez.");
    }
  }

  const body = new FormData();
  body.append('file', file);
  body.append('folder', folder);
  let res: Response;
  try {
    res = await fetch('/api/admin/upload/', { method: 'POST', body });
  } catch {
    throw new Error('Pas de connexion internet. Réessayez.');
  }
  if (res.status === 401) toLogin();
  if (!res.ok) throw new Error(await readError(res, "Le fichier n'a pas pu être envoyé."));
  onProgress?.(100);
  return (await res.json()).url;
}

function canvasToImage(canvas: HTMLCanvasElement): Promise<Blob> {
  const toBlob = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  // WebP si le navigateur sait le faire, sinon JPEG
  return toBlob('image/webp', 0.82).then(async (webp) => {
    if (webp?.type === 'image/webp') return webp;
    const jpeg = await toBlob('image/jpeg', 0.85);
    if (!jpeg) throw new Error('compression');
    return jpeg;
  });
}

/** Réduit une photo (1920 px maximum) avant l'envoi : rapide même en 3G. */
export async function compressImage(file: File, maxSize = 1920): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvasToImage(canvas);
}

export interface VideoInfo {
  /** Image d'aperçu tirée de la vidéo */
  poster: Blob;
  /** Durée affichée, ex. "1:26" */
  duration: string;
  /** Vidéo verticale (filmée au téléphone) */
  portrait: boolean;
}

/** Lit une vidéo dans le navigateur : image d'aperçu, durée et orientation. */
export function readVideo(file: File): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const done = (error?: Error) => {
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      if (error) reject(error);
    };

    video.onerror = () => done(new Error('video'));
    video.onloadedmetadata = () => {
      // Image prise à 1 seconde (évite l'écran noir du tout début)
      video.currentTime = Math.min(1, (video.duration || 2) / 3);
    };
    video.onseeked = async () => {
      try {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
        const seconds = Math.round(video.duration || 0);
        const info = {
          poster: await canvasToImage(canvas),
          duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
          portrait: video.videoHeight > video.videoWidth,
        };
        done();
        resolve(info);
      } catch {
        done(new Error('video'));
      }
    };
    video.src = url;
  });
}

export const isAcceptedVideo = (file: File) => VIDEO_TYPES.includes(file.type) || /\.(mp4|mov|webm)$/i.test(file.name);
export const isTooBigVideo = (file: File) => file.size > MAX_VIDEO_BYTES;
export const MAX_VIDEO_MB = Math.round(MAX_VIDEO_BYTES / 1024 / 1024);

export const slug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
