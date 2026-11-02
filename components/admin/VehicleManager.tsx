'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Car, ImagePlus, Loader2, Plus, X } from 'lucide-react';
import { Field, FormModal, RowActions, moveItem } from '@/components/admin/AdminUi';
import { type Notify, type StorageMode, compressImage, saveList, slug, uploadFile } from '@/components/admin/admin-client';
import type { Vehicle, VehicleType } from '@/data/vehicles';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<VehicleType, string> = { suv: 'SUV', berline: 'Berline', pickup: 'Pick-up' };
/** Nombre de véhicules affichés sur la page d'accueil (voir app/[locale]/page.tsx) */
const HOME_COUNT = 3;

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

interface VehicleManagerProps {
  initialVehicles: Vehicle[];
  storage: StorageMode;
  notify: Notify;
}

export function VehicleManager({ initialVehicles, storage, notify }: VehicleManagerProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  /** Enregistre la liste complète ; renvoie true si c'est réussi. */
  async function persist(next: Vehicle[], success: string) {
    setSaving(true);
    try {
      setVehicles(await saveList('vehicles', next));
      notify('ok', success);
      return true;
    } catch (error) {
      notify('error', (error as Error).message);
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

  return (
    <>
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

              <RowActions
                index={index}
                count={vehicles.length}
                disabled={saving}
                onMove={(step) => persist(moveItem(vehicles, index, step), 'Ordre enregistré.')}
                onEdit={() => setDraft(toDraft(vehicle))}
                onDelete={() => remove(vehicle)}
              />
            </li>
          ))}
        </ul>
      )}

      {draft && (
        <VehicleForm
          initial={draft}
          saving={saving}
          storage={storage}
          onCancel={() => setDraft(null)}
          onSave={saveDraft}
          notify={notify}
        />
      )}
    </>
  );
}

interface VehicleFormProps {
  initial: Draft;
  saving: boolean;
  storage: StorageMode;
  onCancel: () => void;
  onSave: (draft: Draft) => void;
  notify: Notify;
}

/** Fenêtre d'ajout / de modification d'un véhicule. */
function VehicleForm({ initial, saving, storage, onCancel, onSave, notify }: VehicleFormProps) {
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
        let photo: Blob;
        try {
          photo = await compressImage(file);
        } catch {
          throw new Error(`« ${file.name} » n'est pas une photo lisible. Utilisez une photo JPG ou PNG.`);
        }
        const url = await uploadFile(photo, 'vehicules', storage);
        setD((prev) => ({ ...prev, images: [...prev.images, url] }));
      } catch (error) {
        notify('error', (error as Error).message);
      } finally {
        setUploading((n) => n - 1);
      }
    }
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
    <FormModal
      title={isNew ? 'Ajouter un véhicule' : 'Modifier le véhicule'}
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className="btn-outline">
            Annuler
          </button>
          <button type="submit" disabled={busy} className="btn-ink disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {uploading > 0 ? 'Envoi des photos…' : isNew ? 'Ajouter au site' : 'Enregistrer'}
          </button>
        </>
      }
    >
      {/* Photos */}
      <p className="field-label">
        Photos <span className="font-normal text-slate-500">— la première est la photo principale</span>
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {d.images.map((src, index) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist">
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
                <PhotoArrow label="Vers la gauche" disabled={index === 0} onClick={() => set('images', moveItem(d.images, index, -1))}>
                  <ArrowLeft className="h-4 w-4" />
                </PhotoArrow>
                <PhotoArrow
                  label="Vers la droite"
                  disabled={index === d.images.length - 1}
                  onClick={() => set('images', moveItem(d.images, index, 1))}
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
    </FormModal>
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
