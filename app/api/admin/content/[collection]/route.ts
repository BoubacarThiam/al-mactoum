import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import {
  StorageNotConfiguredError,
  collectionTag,
  isCollectionName,
  sanitizeItem,
  saveCollection,
} from '@/lib/content-store';

/** Enregistre une liste complète (véhicules ou vidéos : ajout, modification, suppression, ordre) puis met le site à jour. */
export async function PUT(request: Request, { params }: { params: { collection: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  const name = params.collection;
  if (!isCollectionName(name)) return NextResponse.json({ error: 'Liste inconnue.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!Array.isArray(body) || body.length > 200) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }
  const items = body.map((item) => sanitizeItem(name, item));
  if (items.some((item) => item === null)) {
    const error =
      name === 'vehicles'
        ? 'Chaque véhicule doit avoir une marque, un modèle et au moins une photo.'
        : "Chaque vidéo doit avoir un titre, un fichier vidéo et une image d'aperçu.";
    return NextResponse.json({ error }, { status: 400 });
  }
  if (new Set(items.map((item) => item!.id)).size !== items.length) {
    return NextResponse.json({ error: 'Deux éléments ont le même identifiant.' }, { status: 400 });
  }

  try {
    // Le type exact (véhicules ou vidéos) est garanti par sanitizeItem
    await saveCollection(name, items as never[]);
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return NextResponse.json({ error: error.message }, { status: 503 });
    console.error(error);
    return NextResponse.json({ error: "L'enregistrement a échoué, réessayez." }, { status: 500 });
  }

  // Les pages du site (FR et EN) affichent tout de suite le nouveau contenu
  revalidateTag(collectionTag(name));
  revalidatePath('/', 'layout');
  return NextResponse.json({ items });
}
