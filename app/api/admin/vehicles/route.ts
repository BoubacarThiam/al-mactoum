import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { StorageNotConfiguredError, VEHICLES_TAG, sanitizeVehicle, saveVehicles } from '@/lib/vehicle-store';
import type { Vehicle } from '@/data/vehicles';

/** Enregistre le catalogue complet (ajout, modification, suppression, ordre) puis met le site à jour. */
export async function PUT(request: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!Array.isArray(body) || body.length > 200) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }
  const vehicles = body.map(sanitizeVehicle);
  if (vehicles.some((v) => v === null)) {
    return NextResponse.json({ error: 'Chaque véhicule doit avoir une marque, un modèle et au moins une photo.' }, { status: 400 });
  }
  if (new Set(vehicles.map((v) => v!.id)).size !== vehicles.length) {
    return NextResponse.json({ error: 'Deux véhicules ont le même identifiant.' }, { status: 400 });
  }

  try {
    await saveVehicles(vehicles as Vehicle[]);
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return NextResponse.json({ error: error.message }, { status: 503 });
    console.error(error);
    return NextResponse.json({ error: "L'enregistrement a échoué, réessayez." }, { status: 500 });
  }

  // Les pages Accueil et Véhicules (FR et EN) affichent tout de suite le nouveau catalogue
  revalidateTag(VEHICLES_TAG);
  revalidatePath('/', 'layout');
  return NextResponse.json({ vehicles });
}
