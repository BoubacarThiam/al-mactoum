import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { StorageNotConfiguredError, saveImage } from '@/lib/vehicle-store';

const MAX_SIZE = 4 * 1024 * 1024; // les photos sont déjà réduites dans le navigateur avant l'envoi
const ACCEPTED = ['image/webp', 'image/jpeg', 'image/png'];

/** Envoi d'une photo de véhicule depuis le backoffice. */
export async function POST(request: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });

  const file = (await request.formData().catch(() => null))?.get('file');
  if (!(file instanceof Blob) || !ACCEPTED.includes(file.type)) {
    return NextResponse.json({ error: 'Format de photo non accepté (JPG, PNG ou WebP).' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Photo trop lourde (4 Mo maximum).' }, { status: 413 });
  }

  try {
    return NextResponse.json({ url: await saveImage(file) });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return NextResponse.json({ error: error.message }, { status: 503 });
    console.error(error);
    return NextResponse.json({ error: "La photo n'a pas pu être enregistrée." }, { status: 500 });
  }
}
