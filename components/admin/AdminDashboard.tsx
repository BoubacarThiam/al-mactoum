'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Car, CheckCircle2, ExternalLink, Film, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { VehicleManager } from '@/components/admin/VehicleManager';
import { VideoManager } from '@/components/admin/VideoManager';
import type { Notify, StorageMode } from '@/components/admin/admin-client';
import type { PromoVideo } from '@/data/promos';
import type { Vehicle } from '@/data/vehicles';
import { cn } from '@/lib/utils';

type Tab = 'vehicules' | 'videos';

const TABS: Array<{ id: Tab; label: string; icon: typeof Car }> = [
  { id: 'vehicules', label: 'Véhicules', icon: Car },
  { id: 'videos', label: 'Vidéos', icon: Film },
];

interface AdminDashboardProps {
  vehicles: Vehicle[];
  promos: PromoVideo[];
  operations: PromoVideo[];
  storage: StorageMode;
}

/** Backoffice : en-tête, onglets (véhicules / vidéos) et messages de confirmation. */
export function AdminDashboard({ vehicles, promos, operations, storage }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('vehicules');
  const [toast, setToast] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  // L'onglet ouvert est gardé dans l'adresse (#videos) : il reste ouvert après un rechargement
  useEffect(() => {
    if (window.location.hash === '#videos') setTab('videos');
  }, []);

  function openTab(id: Tab) {
    setTab(id);
    history.replaceState(null, '', id === 'videos' ? '#videos' : window.location.pathname);
  }

  const notify: Notify = (type, text) => {
    clearTimeout(toastTimer.current);
    setToast({ type, text });
    toastTimer.current = setTimeout(() => setToast(null), type === 'ok' ? 3500 : 6000);
  };

  async function logout() {
    await fetch('/api/admin/logout/', { method: 'POST' }).catch(() => null);
    window.location.href = '/admin/login/';
  }

  return (
    <>
      <header className="bg-ink-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Logo className="h-9 sm:h-10" />
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="/fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4" aria-label="Sections du backoffice">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => openTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-bold transition',
                tab === id ? 'bg-mist text-ink-900' : 'text-white/70 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!storage && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              Le stockage des photos et vidéos n&apos;est pas encore branché. Dans Vercel, ouvrez le projet →{' '}
              <strong>Storage</strong> → <strong>Create</strong> → <strong>Blob</strong>, puis redéployez le site.
            </p>
          </div>
        )}

        {/* Les deux onglets restent montés : on ne perd rien en passant de l'un à l'autre */}
        <div hidden={tab !== 'vehicules'}>
          <VehicleManager initialVehicles={vehicles} storage={storage} notify={notify} />
        </div>
        <div hidden={tab !== 'videos'}>
          <VideoManager initial={{ promos, operations }} storage={storage} notify={notify} />
        </div>
      </main>

      {toast && (
        <div
          role="status"
          className={cn(
            'fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg',
            toast.type === 'ok' ? 'bg-ink-900 text-white' : 'bg-red-600 text-white',
          )}
        >
          {toast.type === 'ok' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-mint" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          {toast.text}
        </div>
      )}
    </>
  );
}
