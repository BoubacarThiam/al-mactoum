import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { StorageNotConfiguredError, saveFile, storageMode } from '@/lib/content-store';
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_TYPES } from '@/lib/media-limits';

/**
 * Envoi d'un fichier depuis le backoffice : photos (toujours) et vidéos (en local seulement :
 * en ligne, les vidéos partent directement du navigateur vers Vercel Blob, voir /api/admin/blob-upload).
 */
export async function POST(request: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  const folder = form?.get('folder') === 'videos' ? 'videos' : 'vehicules';
  if (!(file instanceof Blob)) return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 });

  const isVideo = VIDEO_TYPES.includes(file.type);
  if (!IMAGE_TYPES.includes(file.type) && !(isVideo && storageMode() === 'local')) {
    return NextResponse.json({ error: 'Format de fichier non accepté.' }, { status: 400 });
  }
  if (file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
    return NextResponse.json({ error: 'Fichier trop lourd.' }, { status: 413 });
  }

  try {
    return NextResponse.json({ url: await saveFile(file, folder) });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return NextResponse.json({ error: error.message }, { status: 503 });
    console.error(error);
    return NextResponse.json({ error: "Le fichier n'a pas pu être enregistré." }, { status: 500 });
  }
}
