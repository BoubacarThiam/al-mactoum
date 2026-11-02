'use client';

import { useState } from 'react';
import { Film, ImagePlus, Loader2, Play, Plus, Upload } from 'lucide-react';
import { Field, FormModal, RowActions, moveItem } from '@/components/admin/AdminUi';
import {
  MAX_VIDEO_MB,
  type Notify,
  type StorageMode,
  compressImage,
  isAcceptedVideo,
  isTooBigVideo,
  readVideo,
  saveList,
  slug,
  uploadFile,
} from '@/components/admin/admin-client';
import type { PromoVideo } from '@/data/promos';
import { cn } from '@/lib/utils';

type SiteVideo = PromoVideo;
type VideoCollection = 'promos' | 'operations';

const SECTIONS: Record<VideoCollection, { title: string; description: string }> = {
  promos: {
    title: 'Nos publicités',
    description: "Section sur fond noir de l'accueil. Elle est masquée s'il n'y a aucune vidéo.",
  },
  operations: {
    title: 'En vidéo (nos opérations)',
    description: "Chargements, arrivées à Dakar… Section « En vidéo » de l'accueil.",
  },
};

interface Draft {
  id?: string;
  src: string;
  poster: string;
  duration?: string;
  portrait?: boolean;
  titleFr: string;
  titleEn: string;
  captionFr: string;
  captionEn: string;
}

const emptyDraft: Draft = { src: '', poster: '', titleFr: '', titleEn: '', captionFr: '', captionEn: '' };

const toDraft = (v: SiteVideo): Draft => ({
  id: v.id,
  src: v.src,
  poster: v.poster,
  duration: v.duration,
  portrait: v.portrait,
  titleFr: v.title.fr,
  titleEn: v.title.en === v.title.fr ? '' : v.title.en,
  captionFr: v.caption?.fr ?? '',
  captionEn: v.caption && v.caption.en !== v.caption.fr ? v.caption.en : '',
});

function fromDraft(d: Draft): SiteVideo {
  const titleFr = d.titleFr.trim();
  const captionFr = d.captionFr.trim();
  return {
    id: d.id ?? `${slug(titleFr) || 'video'}-${Date.now().toString(36)}`,
    src: d.src,
    poster: d.poster,
    title: { fr: titleFr, en: d.titleEn.trim() || titleFr },
    caption: captionFr ? { fr: captionFr, en: d.captionEn.trim() || captionFr } : undefined,
    duration: d.duration,
    portrait: d.portrait,
  };
}

/** Certains téléphones n'indiquent pas le format : on le déduit de l'extension */
function withVideoType(file: File) {
  if (file.type) return file;
  const type = /\.mov$/i.test(file.name) ? 'video/quicktime' : /\.webm$/i.test(file.name) ? 'video/webm' : 'video/mp4';
  return new File([file], file.name, { type });
}

interface VideoManagerProps {
  initial: Record<VideoCollection, SiteVideo[]>;
  storage: StorageMode;
  notify: Notify;
}

/** Onglet Vidéos : les deux sections vidéo de l'accueil. */
export function VideoManager({ initial, storage, notify }: VideoManagerProps) {
  return (
    <>
      <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">Vidéos</h1>
      <p className="mt-1 text-sm text-slate-600">
        Format MP4 conseillé, moins de {MAX_VIDEO_MB} Mo. Une vidéo courte et légère se lance plus vite chez les visiteurs.
      </p>
      {(['promos', 'operations'] as const).map((collection) => (
        <VideoList key={collection} collection={collection} initial={initial[collection]} storage={storage} notify={notify} />
      ))}
    </>
  );
}

function VideoList({
  collection,
  initial,
  storage,
  notify,
}: {
  collection: VideoCollection;
  initial: SiteVideo[];
  storage: StorageMode;
  notify: Notify;
}) {
  const [videos, setVideos] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const section = SECTIONS[collection];

  async function persist(next: SiteVideo[], success: string) {
    setSaving(true);
    try {
      setVideos(await saveList(collection, next));
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
    const video = fromDraft(d);
    const exists = videos.some((v) => v.id === video.id);
    const next = exists ? videos.map((v) => (v.id === video.id ? video : v)) : [video, ...videos];
    if (await persist(next, exists ? 'Vidéo modifiée. Le site est à jour.' : 'Vidéo ajoutée au site.')) setDraft(null);
  }

  function remove(video: SiteVideo) {
    if (!window.confirm(`Supprimer la vidéo « ${video.title.fr} » du site ?`)) return;
    persist(
      videos.filter((v) => v.id !== video.id),
      'Vidéo supprimée du site.',
    );
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-extrabold">
            {section.title} ({videos.length})
          </h2>
          <p className="mt-1 text-sm text-slate-600">{section.description}</p>
        </div>
        <button type="button" onClick={() => setDraft(emptyDraft)} disabled={saving} className="btn-ink">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Ajouter une vidéo
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed border-ink-900/10 bg-white py-12 text-center">
          <Film className="h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-slate-600">Aucune vidéo dans cette section.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {videos.map((video, index) => (
            <li key={video.id} className="card flex flex-col gap-4 p-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-ink-950 sm:h-24 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={video.poster} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-ink-950">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </span>
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold sm:text-lg">{video.title.fr}</p>
                  {video.caption && <p className="line-clamp-2 text-sm text-slate-500">{video.caption.fr}</p>}
                  <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    {video.duration && (
                      <span className="rounded-full bg-mist px-2 py-0.5 font-medium tabular-nums text-slate-600">
                        {video.duration}
                      </span>
                    )}
                    <span className="rounded-full bg-mist px-2 py-0.5 font-medium text-slate-600">
                      {video.portrait ? 'Verticale' : 'Horizontale'}
                    </span>
                  </p>
                </div>
              </div>

              <RowActions
                index={index}
                count={videos.length}
                disabled={saving}
                onMove={(step) => persist(moveItem(videos, index, step), 'Ordre enregistré.')}
                onEdit={() => setDraft(toDraft(video))}
                onDelete={() => remove(video)}
              />
            </li>
          ))}
        </ul>
      )}

      {draft && (
        <VideoForm
          initial={draft}
          sectionTitle={section.title}
          saving={saving}
          storage={storage}
          onCancel={() => setDraft(null)}
          onSave={saveDraft}
          notify={notify}
        />
      )}
    </section>
  );
}

interface VideoFormProps {
  initial: Draft;
  sectionTitle: string;
  saving: boolean;
  storage: StorageMode;
  onCancel: () => void;
  onSave: (draft: Draft) => void;
  notify: Notify;
}

/** Fenêtre d'ajout / de modification d'une vidéo. */
function VideoForm({ initial, sectionTitle, saving, storage, onCancel, onSave, notify }: VideoFormProps) {
  const [d, setD] = useState(initial);
  /** Avancement de l'envoi de la vidéo, en % (null = pas d'envoi en cours) */
  const [progress, setProgress] = useState<number | null>(null);
  const [posterLoading, setPosterLoading] = useState(false);
  const [missingVideo, setMissingVideo] = useState(false);
  const isNew = !initial.id;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((prev) => ({ ...prev, [key]: value }));

  async function chooseVideo(picked: File | undefined) {
    if (!picked) return;
    setMissingVideo(false);
    if (!isAcceptedVideo(picked)) {
      notify('error', 'Choisissez une vidéo MP4 (ou MOV depuis un iPhone).');
      return;
    }
    if (isTooBigVideo(picked)) {
      notify('error', `Vidéo trop lourde (${MAX_VIDEO_MB} Mo maximum). Raccourcissez-la ou compressez-la avant l'envoi.`);
      return;
    }
    const file = withVideoType(picked);
    setProgress(0);
    try {
      let info;
      try {
        info = await readVideo(file);
      } catch {
        throw new Error("Cette vidéo ne peut pas être lue par le navigateur. Enregistrez-la en MP4 (H.264) et réessayez.");
      }
      // Image d'aperçu d'abord (légère), puis la vidéo avec sa barre d'avancement
      const poster = await uploadFile(info.poster, 'videos', storage);
      const src = await uploadFile(file, 'videos', storage, (p) => setProgress(Math.round(p)));
      setD((prev) => ({ ...prev, src, poster, duration: info.duration, portrait: info.portrait }));
    } catch (error) {
      notify('error', (error as Error).message);
    } finally {
      setProgress(null);
    }
  }

  async function choosePoster(file: File | undefined) {
    if (!file) return;
    setPosterLoading(true);
    try {
      let image: Blob;
      try {
        image = await compressImage(file, 1280);
      } catch {
        throw new Error(`« ${file.name} » n'est pas une image lisible. Utilisez une photo JPG ou PNG.`);
      }
      set('poster', await uploadFile(image, 'videos', storage));
    } catch (error) {
      notify('error', (error as Error).message);
    } finally {
      setPosterLoading(false);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!d.src || !d.poster) {
      setMissingVideo(true);
      return;
    }
    onSave(d);
  }

  const uploading = progress !== null;
  const busy = saving || uploading || posterLoading;

  return (
    <FormModal
      title={isNew ? `Ajouter une vidéo — ${sectionTitle}` : 'Modifier la vidéo'}
      onSubmit={submit}
      onCancel={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className="btn-outline">
            Annuler
          </button>
          <button type="submit" disabled={busy} className="btn-ink disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {uploading ? 'Envoi de la vidéo…' : isNew ? 'Ajouter au site' : 'Enregistrer'}
          </button>
        </>
      }
    >
      {/* Vidéo */}
      <p className="field-label">Vidéo *</p>
      {uploading ? (
        <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl bg-mist px-6">
          <Loader2 className="h-7 w-7 animate-spin text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink-900">Envoi de la vidéo… {progress}%</p>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-ink-900/10">
            <div className="h-full rounded-full bg-mint-dark transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-500">Gardez cette page ouverte jusqu&apos;à la fin.</p>
        </div>
      ) : d.src ? (
        <div className={cn('mx-auto overflow-hidden rounded-xl bg-ink-950', d.portrait ? 'aspect-[9/16] max-h-[50vh]' : 'aspect-video')}>
          <video key={d.src} src={d.src} poster={d.poster} controls playsInline className="h-full w-full" />
        </div>
      ) : (
        <VideoPicker missing={missingVideo} onPick={chooseVideo} label="Choisir une vidéo" />
      )}

      {d.src && !uploading && (
        <div className="mt-3 flex flex-wrap gap-2">
          <PickerButton accept="video/*,.mov" onPick={chooseVideo} icon={<Upload className="h-4 w-4" />}>
            Remplacer la vidéo
          </PickerButton>
          <PickerButton accept="image/*" onPick={choosePoster} icon={posterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}>
            Changer l&apos;image d&apos;aperçu
          </PickerButton>
        </div>
      )}
      {missingVideo && <p className="mt-2 text-sm font-medium text-red-600">Ajoutez une vidéo.</p>}

      {/* Textes */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Titre *">
          <input
            required
            maxLength={100}
            value={d.titleFr}
            onChange={(e) => set('titleFr', e.target.value)}
            placeholder="Arrivée à Dakar"
            className="field"
          />
        </Field>
        <Field label="Titre en anglais" hint="Facultatif">
          <input
            maxLength={100}
            value={d.titleEn}
            onChange={(e) => set('titleEn', e.target.value)}
            placeholder="Arrival in Dakar"
            className="field"
          />
        </Field>
        <Field label="Légende" hint="Facultatif">
          <textarea
            rows={2}
            maxLength={200}
            value={d.captionFr}
            onChange={(e) => set('captionFr', e.target.value)}
            placeholder="Un SUV Hyundai sorti de son conteneur à Dakar."
            className="field resize-none"
          />
        </Field>
        <Field label="Légende en anglais" hint="Facultatif">
          <textarea
            rows={2}
            maxLength={200}
            value={d.captionEn}
            onChange={(e) => set('captionEn', e.target.value)}
            className="field resize-none"
          />
        </Field>
      </div>
    </FormModal>
  );
}

function VideoPicker({ missing, onPick, label }: { missing: boolean; onPick: (file?: File) => void; label: string }) {
  return (
    <label
      className={cn(
        'flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-semibold transition hover:bg-mist',
        missing ? 'border-red-400 text-red-600' : 'border-ink-900/15 text-slate-600',
      )}
    >
      <Film className="h-8 w-8" aria-hidden="true" />
      {label}
      <span className="text-xs font-normal text-slate-500">L&apos;image d&apos;aperçu et la durée sont ajoutées automatiquement</span>
      <input
        type="file"
        accept="video/*,.mov"
        className="sr-only"
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}

function PickerButton({
  accept,
  onPick,
  icon,
  children,
}: {
  accept: string;
  onPick: (file?: File) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-ink-900/15 px-3 text-sm font-semibold hover:bg-mist">
      {icon}
      {children}
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}
