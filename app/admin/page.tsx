import { redirect } from 'next/navigation';
import { VehicleManager } from '@/components/admin/VehicleManager';
import { isAuthenticated } from '@/lib/admin-auth';
import { isStorageReady, readVehicles } from '@/lib/vehicle-store';

export const dynamic = 'force-dynamic';

/** Backoffice : gestion des véhicules affichés sur le site. */
export default async function AdminPage() {
  if (!isAuthenticated()) redirect('/admin/login/');
  const vehicles = await readVehicles();
  return <VehicleManager initialVehicles={vehicles} storageReady={isStorageReady()} />;
}
