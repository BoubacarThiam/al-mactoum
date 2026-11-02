'use client';

/** Petits éléments d'interface partagés par les pages du backoffice. */

import { ArrowDown, ArrowUp, Pencil, Trash2, X } from 'lucide-react';

export function IconButton({
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

/** Boutons d'une ligne de liste : monter, descendre, modifier, supprimer */
export function RowActions({
  index,
  count,
  disabled,
  onMove,
  onEdit,
  onDelete,
}: {
  index: number;
  count: number;
  disabled: boolean;
  onMove: (step: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5 border-t border-ink-900/[0.06] pt-3 sm:border-0 sm:pt-0">
      <IconButton label="Monter" disabled={disabled || index === 0} onClick={() => onMove(-1)}>
        <ArrowUp className="h-4 w-4" />
      </IconButton>
      <IconButton label="Descendre" disabled={disabled || index === count - 1} onClick={() => onMove(1)}>
        <ArrowDown className="h-4 w-4" />
      </IconButton>
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        className="ml-1 flex h-10 items-center gap-2 rounded-xl border border-ink-900/15 px-3 text-sm font-semibold hover:bg-mist disabled:opacity-40"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
        Modifier
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        className="flex h-10 items-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Supprimer</span>
      </button>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">
        {label} {hint && <span className="font-normal text-slate-500">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Fenêtre de formulaire (plein écran en bas sur téléphone, centrée sur ordinateur) */
export function FormModal({
  title,
  onSubmit,
  onCancel,
  footer,
  children,
}: {
  title: string;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-form-title"
    >
      <form
        onSubmit={onSubmit}
        className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-ink-900/[0.07] px-5 py-4">
          <h2 id="admin-form-title" className="font-heading text-xl font-extrabold">
            {title}
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
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex flex-col-reverse gap-2 border-t border-ink-900/[0.07] px-5 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      </form>
    </div>
  );
}

/** Déplace un élément d'une liste d'un cran vers le haut (-1) ou le bas (+1) */
export function moveItem<T>(list: T[], index: number, step: number) {
  const next = [...list];
  [next[index], next[index + step]] = [next[index + step], next[index]];
  return next;
}
