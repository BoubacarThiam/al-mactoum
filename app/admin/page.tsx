import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { isAuthenticated } from '@/lib/admin-auth';
import { readCollection, storageMode } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

/** Backoffice : gestion des véhicules et des vidéos affichés sur le site. */
export default async function AdminPage() {
  if (!isAuthenticated()) redirect('/admin/login/');
  const [vehicles, promos, operations] = await Promise.all([
    readCollection('vehicles'),
    readCollection('promos'),
    readCollection('operations'),
  ]);
  return <AdminDashboard vehicles={vehicles} promos={promos} operations={operations} storage={storageMode()} />;
}
