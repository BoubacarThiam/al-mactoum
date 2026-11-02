/**
 * Stockage du contenu modifiable depuis le backoffice (/admin) : véhicules et vidéos.
 *
 * - En ligne (Vercel) : listes et fichiers dans Vercel Blob (variable BLOB_READ_WRITE_TOKEN).
 * - En local, sans Vercel Blob : listes dans .data/ et fichiers dans public/uploads.
 * - Tant que rien n'a été enregistré, les listes de /data servent de contenu de départ.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { del, get, put } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import { type PromoVideo, promoVideos } from '@/data/promos';
import { type Vehicle, type VehicleType, vehicles as defaultVehicles } from '@/data/vehicles';
import { operationVideos } from '@/data/videos';

/** Une vidéo du site (section « Nos publicités » ou « En vidéo ») */
export type SiteVideo = PromoVideo;

interface Collections {
  vehicles: Vehicle;
  promos: SiteVideo;
  operations: SiteVideo;
}
export type CollectionName = keyof Collections;

const COLLECTIONS: { [K in CollectionName]: { file: string; defaults: Collections[K][] } } = {
  vehicles: { file: 'vehicules.json', defaults: defaultVehicles },
  promos: { file: 'videos-publicites.json', defaults: promoVideos },
  operations: { file: 'videos-operations.json', defaults: operationVideos },
};

export const isCollectionName = (value: string): value is CollectionName => value in COLLECTIONS;
export const collectionTag = (name: CollectionName) => `content-${name}`;

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** 'blob' en ligne, 'local' sur l'ordinateur sans Vercel Blob, null en ligne tant que Vercel Blob n'est pas branché. */
export function storageMode(): 'blob' | 'local' | null {
  if (useBlob()) return 'blob';
  return process.env.NODE_ENV === 'production' ? null : 'local';
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super('Stockage non configuré : ajoutez un store Vercel Blob au projet Vercel.');
  }
}

const blobPath = (name: CollectionName) => `catalogue/${COLLECTIONS[name].file}`;
const localPath = (name: CollectionName) => path.join(process.cwd(), '.data', COLLECTIONS[name].file);

async function readStored<K extends CollectionName>(name: K): Promise<Collections[K][] | null> {
  if (useBlob()) {
    const res = await get(blobPath(name), { access: 'public', useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text());
  }
  try {
    return JSON.parse(await fs.readFile(localPath(name), 'utf8'));
  } catch {
    return null;
  }
}

/** Liste à jour (lecture directe, pour le backoffice). */
export async function readCollection<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  return (await readStored(name)) ?? COLLECTIONS[name].defaults;
}

/** Liste mise en cache pour le site public, rafraîchie à chaque enregistrement (revalidateTag). */
const cached = <K extends CollectionName>(name: K) =>
  unstable_cache(() => readCollection(name), ['content', name], { tags: [collectionTag(name)], revalidate: 3600 });

export const getVehicles = cached('vehicles');
export const getPromoVideos = cached('promos');
export const getOperationVideos = cached('operations');

/** Fichier envoyé depuis le backoffice (Vercel Blob ou public/uploads), donc supprimable. */
const isUploaded = (src: string) => src.startsWith('/uploads/') || /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(src);

/** Photos et vidéos utilisées par un élément */
const filesOf = (item: Vehicle | SiteVideo) => ('images' in item ? item.images : [item.src, item.poster]);

/** Enregistre une liste et supprime les fichiers envoyés qui ne servent plus. */
export async function saveCollection<K extends CollectionName>(name: K, next: Collections[K][]) {
  if (!storageMode()) throw new StorageNotConfiguredError();
  const previous = await readCollection(name);
  const json = JSON.stringify(next, null, 2);

  if (useBlob()) {
    await put(blobPath(name), json, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
  } else {
    await fs.mkdir(path.dirname(localPath(name)), { recursive: true });
    await fs.writeFile(localPath(name), json);
  }

  const kept = new Set(next.flatMap(filesOf));
  const orphans = previous.flatMap(filesOf).filter((src) => !kept.has(src) && isUploaded(src));
  // Un fichier non supprimé ne gêne pas le site : on n'échoue pas pour ça
  await deleteFiles(orphans).catch((error) => console.error('Suppression des fichiers impossible', error));
}

async function deleteFiles(srcs: string[]) {
  if (srcs.length === 0) return;
  const remote = srcs.filter((src) => src.startsWith('https://'));
  if (remote.length && useBlob()) await del(remote);
  for (const src of srcs.filter((s) => s.startsWith('/uploads/'))) {
    await fs.rm(path.join(process.cwd(), 'public', src), { force: true });
  }
}

const EXTENSIONS: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
};

/** Enregistre un fichier envoyé depuis le backoffice et renvoie son adresse. */
export async function saveFile(file: Blob, folder: 'vehicules' | 'videos'): Promise<string> {
  const mode = storageMode();
  if (!mode) throw new StorageNotConfiguredError();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXTENSIONS[file.type] ?? 'bin'}`;

  if (mode === 'blob') {
    const blob = await put(`${folder}/${name}`, file, { access: 'public', contentType: file.type });
    return blob.url;
  }
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${name}`;
}

/* ---------- Vérification des données reçues du backoffice ---------- */

const TYPES: VehicleType[] = ['suv', 'berline', 'pickup'];
const text = (value: unknown, max = 120) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const positive = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value) : undefined);
const cleanId = (value: unknown) => text(value, 80).replace(/[^a-z0-9-]/gi, '');
const isFileSrc = (prefix: string) => (src: unknown): src is string =>
  typeof src === 'string' && (src.startsWith(prefix) || isUploaded(src));

/** Texte en français + anglais (l'anglais reprend le français s'il est vide) */
function bilingual(value: unknown, max: number) {
  const v = (value ?? {}) as Record<string, unknown>;
  const fr = text(v.fr, max);
  return fr ? { fr, en: text(v.en, max) || fr } : undefined;
}

function sanitizeVehicle(input: Record<string, unknown>): Vehicle | null {
  const brand = text(input.brand, 40);
  const model = text(input.model, 60);
  const images = Array.isArray(input.images) ? input.images.filter(isFileSrc('/images/')).slice(0, 12) : [];
  const id = cleanId(input.id);
  if (!id || !brand || !model || images.length === 0) return null;

  return {
    id,
    brand,
    model,
    type: TYPES.includes(input.type as VehicleType) ? (input.type as VehicleType) : 'suv',
    color: bilingual(input.color, 40),
    year: positive(input.year),
    mileageKm: positive(input.mileageKm),
    images,
    imageAlt: text(input.imageAlt, 160) || `${brand} ${model}`,
    price: text(input.price, 40) || undefined,
    isExample: input.isExample === true || undefined,
  };
}

function sanitizeVideo(input: Record<string, unknown>): SiteVideo | null {
  const id = cleanId(input.id);
  const title = bilingual(input.title, 100);
  const isVideoFile = isFileSrc('/videos/');
  if (!id || !title || !isVideoFile(input.src) || !isVideoFile(input.poster)) return null;

  const duration = text(input.duration, 8);
  return {
    id,
    src: input.src,
    poster: input.poster,
    title,
    caption: bilingual(input.caption, 200),
    duration: /^\d{1,2}:\d{2}$/.test(duration) ? duration : undefined,
    portrait: input.portrait === true || undefined,
  };
}

/** Vérifie un élément reçu du backoffice. Renvoie null s'il est invalide. */
export function sanitizeItem(name: CollectionName, input: unknown) {
  if (!input || typeof input !== 'object') return null;
  const item = input as Record<string, unknown>;
  return name === 'vehicles' ? sanitizeVehicle(item) : sanitizeVideo(item);
}
