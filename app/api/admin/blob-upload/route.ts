import { type HandleUploadBody, handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { MAX_VIDEO_BYTES, VIDEO_TYPES } from '@/lib/media-limits';

/**
 * Autorise l'envoi direct d'une vidéo du navigateur vers Vercel Blob
 * (les vidéos sont trop lourdes pour passer par le serveur, limité à 4,5 Mo par requête).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isAuthenticated()) throw new Error('Session expirée.');
        if (!pathname.startsWith('videos/')) throw new Error('Emplacement non autorisé.');
        return { allowedContentTypes: VIDEO_TYPES, maximumSizeInBytes: MAX_VIDEO_BYTES, addRandomSuffix: true };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Envoi refusé.' }, { status: 400 });
  }
}
