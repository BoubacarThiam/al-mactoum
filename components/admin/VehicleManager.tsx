'use client';

import { useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Car,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import type { Vehicle, VehicleType } from '@/data/vehicles';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<VehicleType, string> = { suv: 'SUV', berline: 'Berline', pickup: 'Pick-up' };
/** Nombre de véhicules affichés sur la page d'accueil (voir app/[locale]/page.tsx) */
const HOME_COUNT = 3;
/** Les photos sont réduites dans le navigateur avant l'envoi : rapide même en 3G */
const MAX_PHOTO_SIZE = 1920;

interface Draft {
  id?: string;
  brand: string;
  model: string;
  type: VehicleType;
  colorFr: string;
  colorEn: string;
  year: string;
  mileageKm: string;
  price: string;
  images: string[];
  isExample?: boolean;
}

const emptyDraft: Draft = {
  brand: '',
  model: '',
  type: 'suv',
  colorFr: '',
  colorEn: '',
  year: '',
  mileageKm: '',
  price: '',
  images: [],
};

const toDraft = (v: Vehicle): Draft => ({
  id: v.id,
  brand: v.brand,
  model: v.model,
  type: v.type,
  colorFr: v.color?.fr ?? '',
  colorEn: v.color?.en ?? '',
  year: v.year ? String(v.year) : '',
  mileageKm: v.mileageKm ? String(v.mileageKm) : '',
  price: v.price ?? '',
  images: v.images,
  isExample: v.isExample,
});

const slug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function fromDraft(d: Draft): Vehicle {
  const colorFr = d.colorFr.trim();
  const name = [d.brand.trim(), d.model.trim(), colorFr.toLowerCase()].filter(Boolean).join(' ');
  return {
    id: d.id ?? `${slug(name)}-${Date.now().toString(36)}`,
    brand: d.brand.trim(),
    model: d.model.trim(),
    type: d.type,
    color: colorFr ? { fr: colorFr, en: d.colorEn.trim() || colorFr } : undefined,
    year: Number(d.year) || undefined,
    mileageKm: Number(d.mileageKm.replace(/\D/g, '')) || undefined,
    images: d.images,
    imageAlt: name,
    price: d.price.trim() || undefined,
    isExample: d.isExample,
  };
}

/** Réduit la photo (taille max 1920 px) et la convertit en WebP, ou JPEG si le navigateur ne sait pas faire de WebP. */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_PHOTO_SIZE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  const webp = await toBlob('image/webp', 0.82);
  if (webp?.type === 'image/webp') return webp;
  const jpeg = await toBlob('image/jpeg', 0.85);
  if (!jpeg) throw new Error('compression');
  return jpeg;
}

async function readError(res: Response, fallback: string) {
  return (await res.json().catch(() => null))?.error ?? fallback;
}

interface VehicleManagerProps {
  initialVehicles: Vehicle[];
  storageReady: boolean;
}

export function VehicleManager({ initialVehicles, storageReady }: VehicleManagerProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  function notify(type: 'ok' | 'error', text: string) {
    clearTimeout(toastTimer.current);
    setToast({ type, text });
    toastTimer.current = setTimeout(() => setToast(null), type === 'ok' ? 3500 : 6000);
  }

  /** Enregistre la liste complète ; renvoie true si c'est réussi. */
  async function persist(next: Vehicle[], success: string) {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/vehicles/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (res.status === 401) {
        window.location.href = '/admin/login/';
        return false;
      }
      if (!res.ok) {
        notify('error', await readError(res, "L'enregistrement a échoué."));
        return false;
      }
      setVehicles((await res.json()).vehicles);
      notify('ok', success);
      return true;
    } catch {
      notify('error', 'Pas de connexion internet. Réessayez.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft(d: Draft) {
    const vehicle = fromDraft(d);
    const exists = vehicles.some((v) => v.id === vehicle.id);
    // Un nouveau véhicule est placé en tête : il apparaît aussi sur l'accueil
    const next = exists ? vehicles.map((v) => (v.id === vehicle.id ? vehicle : v)) : [vehicle, ...vehicles];
    if (await persist(next, exists ? 'Véhicule modifié. Le site est à jour.' : 'Véhicule ajouté au site.')) {
      setDraft(null);
    }
  }

  function remove(vehicle: Vehicle) {
    if (!window.confirm(`Supprimer ${vehicle.brand} ${vehicle.model} du site ? Ses photos seront aussi supprimées.`)) return;
    persist(
      vehicles.filter((v) => v.id !== vehicle.id),
      'Véhicule supprimé du site.',
    );
  }

  function move(index: number, step: number) {
    const next = [...vehicles];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    persist(next, 'Ordre enregistré.');
  }

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
              href="/fr/vehicules/"
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
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!storageReady && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              Le stockage des photos n&apos;est pas encore branché. Dans Vercel, ouvrez le projet → <strong>Storage</strong>{' '}
              → <strong>Create</strong> → <strong>Blob</strong>, puis redéployez le site.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">Véhicules ({vehicles.length})</h1>
            <p className="mt-1 text-sm text-slate-600">
              Les {HOME_COUNT} premiers apparaissent sur la page d&apos;accueil. Utilisez les flèches pour changer l&apos;ordre.
            </p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft)} disabled={saving} className="btn-ink">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Ajouter un véhicule
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border-2 border-dashed border-ink-900/10 bg-white py-16 text-center">
            <Car className="h-12 w-12 text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-slate-600">Aucun véhicule sur le site pour le moment.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {vehicles.map((vehicle, index) => (
              <li key={vehicle.id} className="card flex flex-col gap-4 p-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicle.images[0]}
                    alt=""
                    className="h-20 w-28 shrink-0 rounded-xl bg-mist object-cover sm:h-24 sm:w-32"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark">{vehicle.brand}</p>
                    <p className="truncate font-heading text-lg font-bold">{vehicle.model}</p>
                    <p className="text-sm text-slate-500">
                      {[TYPE_LABELS[vehicle.type], vehicle.color?.fr, vehicle.year, vehicle.price || 'Sur devis']
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-full bg-mist px-2 py-0.5 font-medium text-slate-600">
                        {vehicle.images.length} photo{vehicle.images.length > 1 ? 's' : ''}
                      </span>
                      {index < HOME_COUNT && (
                        <span className="rounded-full bg-mint/40 px-2 py-0.5 font-semibold text-mint-dark">Accueil</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 border-t border-ink-900/[0.06] pt-3 sm:border-0 sm:pt-0">
                  <IconButton label="Monter" disabled={saving || index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Descendre"
                    disabled={saving || index === vehicles.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                  <button
                    type="button"
                    onClick={() => setDraft(toDraft(vehicle))}
                    disabled={saving}
                    className="ml-1 flex h-10 items-center gap-2 rounded-xl border border-ink-900/15 px-3 text-sm font-semibold hover:bg-mist disabled:opacity-40"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(vehicle)}
                    disabled={saving}
                    className="flex h-10 items-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">Supprimer</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {draft && <VehicleForm initial={draft} saving={saving} onCancel={() => setDraft(null)} onSave={saveDraft} notify={notify} />}

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

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-900/15 text-ink-900 hover:bg-mist disabled:opacity-30"
    >
      {children}
    </button>
  );
}

interface VehicleFormProps {
  initial: Draft;
  saving: boolean;
  onCancel: () => void;
  onSave: (draft: Draft) => void;
  notify: (type: 'ok' | 'error', text: string) => void;
}

/** Fenêtre d'ajout / de modification d'un véhicule. */
function VehicleForm({ initial, saving, onCancel, onSave, notify }: VehicleFormProps) {
  const [d, setD] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [missingPhoto, setMissingPhoto] = useState(false);
  const isNew = !initial.id;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((prev) => ({ ...prev, [key]: value }));

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setMissingPhoto(false);
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    // Envoi l'une après l'autre : l'ordre choisi est conservé
    for (const file of list) {
      try {
        const body = new FormData();
        body.append('file', await compressImage(file));
        const res = await fetch('/api/admin/upload/', { method: 'POST', body });
        if (res.status === 401) {
          window.location.href = '/admin/login/';
          return;
        }
        if (!res.ok) throw new Error(await readError(res, "La photo n'a pas pu être envoyée."));
        const { url } = await res.json();
        setD((prev) => ({ ...prev, images: [...prev.images, url] }));
      } catch (error) {
        notify(
          'error',
          error instanceof Error && error.message !== 'compression' && !(error instanceof DOMException)
            ? error.message
            : `« ${file.name} » n'est pas une photo lisible. Utilisez une photo JPG ou PNG.`,
        );
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  function movePhoto(index: number, step: number) {
    const images = [...d.images];
    [images[index], images[index + step]] = [images[index + step], images[index]];
    set('images', images);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (d.images.length === 0) {
      setMissingPhoto(true);
      return;
    }
    onSave(d);
  }

  const busy = saving || uploading > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="vehicle-form-title">
      <form
        onSubmit={submit}
        className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-ink-900/[0.07] px-5 py-4">
          <h2 id="vehicle-form-title" className="font-heading text-xl font-extrabold">
            {isNew ? 'Ajouter un véhicule' : 'Modifier le véhicule'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fermer"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-mist hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Photos */}
          <p className="field-label">
            Photos <span className="font-normal text-slate-500">— la première est la photo principale</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {d.images.map((src, index) => (
              <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-mint px-2 py-0.5 text-[0.7rem] font-bold text-ink-950">
                    Principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => set('images', d.images.filter((s) => s !== src))}
                  aria-label={`Retirer la photo ${index + 1}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow"
                >
                  <X className="h-4 w-4" />
                </button>
                {d.images.length > 1 && (
                  <div className="absolute inset-x-2 bottom-2 flex justify-between">
                    <PhotoArrow label="Vers la gauche" disabled={index === 0} onClick={() => movePhoto(index, -1)}>
                      <ArrowLeft className="h-4 w-4" />
                    </PhotoArrow>
                    <PhotoArrow
                      label="Vers la droite"
                      disabled={index === d.images.length - 1}
                      onClick={() => movePhoto(index, 1)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </PhotoArrow>
                  </div>
                )}
              </div>
            ))}

            {Array.from({ length: uploading }, (_, i) => (
              <div key={`upload-${i}`} className="flex aspect-[4/3] items-center justify-center rounded-xl bg-mist">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label="Envoi en cours" />
              </div>
            ))}

            <label
              className={cn(
                'flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-sm font-semibold transition hover:bg-mist',
                missingPhoto ? 'border-red-400 text-red-600' : 'border-ink-900/15 text-slate-600',
              )}
            >
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
              Ajouter des photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
          {missingPhoto && <p className="mt-2 text-sm font-medium text-red-600">Ajoutez au moins une photo.</p>}

          {/* Informations */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Marque *">
              <input required value={d.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Toyota" className="field" />
            </Field>
            <Field label="Modèle *">
              <input required value={d.model} onChange={(e) => set('model', e.target.value)} placeholder="RAV4" className="field" />
            </Field>
            <Field label="Type">
              <select value={d.type} onChange={(e) => set('type', e.target.value as VehicleType)} className="field">
                {(Object.keys(TYPE_LABELS) as VehicleType[]).map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Prix" hint="Vide = « Sur devis »">
              <input value={d.price} onChange={(e) => set('price', e.target.value)} placeholder="12 500 000 FCFA" className="field" />
            </Field>
            <Field label="Couleur (français)">
              <input value={d.colorFr} onChange={(e) => set('colorFr', e.target.value)} placeholder="Gris" className="field" />
            </Field>
            <Field label="Couleur (anglais)" hint="Pour la version anglaise du site">
              <input value={d.colorEn} onChange={(e) => set('colorEn', e.target.value)} placeholder="Grey" className="field" />
            </Field>
            <Field label="Année">
              <input
                type="number"
                inputMode="numeric"
                min={1980}
                max={2100}
                value={d.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="2021"
                className="field"
              />
            </Field>
            <Field label="Kilométrage (km)">
              <input
                inputMode="numeric"
                value={d.mileageKm}
                onChange={(e) => set('mileageKm', e.target.value)}
                placeholder="85000"
                className="field"
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-ink-900/[0.07] px-5 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-outline">
            Annuler
          </button>
          <button type="submit" disabled={busy} className="btn-ink disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {uploading > 0 ? 'Envoi des photos…' : isNew ? 'Ajouter au site' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">
        {label} {hint && <span className="font-normal text-slate-500">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function PhotoArrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow disabled:invisible"
    >
      {children}
    </button>
  );
}
