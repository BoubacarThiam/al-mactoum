/**
 * Stockage du catalogue modifiable depuis le backoffice (/admin).
 *
 * - En ligne (Vercel) : catalogue et photos dans Vercel Blob (variable BLOB_READ_WRITE_TOKEN).
 * - En local, sans Vercel Blob : catalogue dans .data/vehicules.json et photos dans public/uploads.
 * - Tant que rien n'a été enregistré, la liste de data/vehicles.ts sert de catalogue de départ.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { del, get, put } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import { type Vehicle, type VehicleType, vehicles as defaultVehicles } from '@/data/vehicles';

const BLOB_PATH = 'catalogue/vehicules.json';
const LOCAL_FILE = path.join(process.cwd(), '.data', 'vehicules.json');
const LOCAL_UPLOADS = path.join(process.cwd(), 'public', 'uploads', 'vehicules');

export const VEHICLES_TAG = 'vehicles';

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** false en ligne tant que Vercel Blob n'est pas branché : le backoffice ne peut pas enregistrer. */
export const isStorageReady = () => useBlob() || process.env.NODE_ENV !== 'production';

export class StorageNotConfiguredError extends Error {
  constructor() {
    super('Stockage non configuré : ajoutez un store Vercel Blob au projet Vercel.');
  }
}

async function readStored(): Promise<Vehicle[] | null> {
  if (useBlob()) {
    const res = await get(BLOB_PATH, { access: 'public', useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text());
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'));
  } catch {
    return null;
  }
}

/** Catalogue à jour (lecture directe, pour le backoffice). */
export async function readVehicles(): Promise<Vehicle[]> {
  return (await readStored()) ?? defaultVehicles;
}

/** Catalogue mis en cache pour le site public, rafraîchi à chaque enregistrement (revalidateTag). */
export const getVehicles = unstable_cache(readVehicles, ['vehicles'], { tags: [VEHICLES_TAG], revalidate: 3600 });

/** Photo envoyée depuis le backoffice (Vercel Blob ou public/uploads), donc supprimable. */
const isUploaded = (src: string) => src.startsWith('/uploads/') || /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(src);

/** Enregistre le catalogue et supprime les photos envoyées qui ne servent plus. */
export async function saveVehicles(next: Vehicle[]) {
  if (!isStorageReady()) throw new StorageNotConfiguredError();
  const previous = await readVehicles();
  const json = JSON.stringify(next, null, 2);

  if (useBlob()) {
    await put(BLOB_PATH, json, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
  } else {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, json);
  }

  const kept = new Set(next.flatMap((v) => v.images));
  const orphans = previous.flatMap((v) => v.images).filter((src) => !kept.has(src) && isUploaded(src));
  // Une photo non supprimée ne gêne pas le site : on n'échoue pas pour ça
  await deleteImages(orphans).catch((error) => console.error('Suppression des photos impossible', error));
}

async function deleteImages(srcs: string[]) {
  if (srcs.length === 0) return;
  const remote = srcs.filter((src) => src.startsWith('https://'));
  if (remote.length && useBlob()) await del(remote);
  for (const src of srcs.filter((s) => s.startsWith('/uploads/'))) {
    await fs.rm(path.join(process.cwd(), 'public', src), { force: true });
  }
}

/** Enregistre une photo envoyée depuis le backoffice et renvoie son adresse. */
export async function saveImage(file: Blob): Promise<string> {
  if (!isStorageReady()) throw new StorageNotConfiguredError();
  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (useBlob()) {
    const blob = await put(`vehicules/${name}`, file, { access: 'public', contentType: file.type });
    return blob.url;
  }
  await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOADS, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/vehicules/${name}`;
}

const TYPES: VehicleType[] = ['suv', 'berline', 'pickup'];
const text = (value: unknown, max = 120) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const positive = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value) : undefined);
const isImageSrc = (src: unknown): src is string =>
  typeof src === 'string' && (src.startsWith('/images/') || isUploaded(src));

/** Vérifie un véhicule reçu du backoffice. Renvoie null s'il est invalide. */
export function sanitizeVehicle(input: unknown): Vehicle | null {
  if (!input || typeof input !== 'object') return null;
  const v = input as Record<string, unknown>;
  const brand = text(v.brand, 40);
  const model = text(v.model, 60);
  const images = Array.isArray(v.images) ? v.images.filter(isImageSrc).slice(0, 12) : [];
  const id = text(v.id, 80).replace(/[^a-z0-9-]/gi, '');
  if (!id || !brand || !model || images.length === 0) return null;

  const colorFr = text((v.color as Record<string, unknown> | undefined)?.fr, 40);
  const colorEn = text((v.color as Record<string, unknown> | undefined)?.en, 40);
  return {
    id,
    brand,
    model,
    type: TYPES.includes(v.type as VehicleType) ? (v.type as VehicleType) : 'suv',
    color: colorFr ? { fr: colorFr, en: colorEn || colorFr } : undefined,
    year: positive(v.year),
    mileageKm: positive(v.mileageKm),
    images,
    imageAlt: text(v.imageAlt, 160) || `${brand} ${model}`,
    price: text(v.price, 40) || undefined,
    isExample: v.isExample === true || undefined,
  };
}
