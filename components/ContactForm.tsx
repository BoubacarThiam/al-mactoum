'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/lib/i18n';
import { cn, fill, formatFCFA, whatsappLink } from '@/lib/utils';

type FormT = Dictionary['contact']['form'];

interface FormValues {
  name: string;
  phone: string;
  email: string;
  city: string;
  brand: string;
  model: string;
  year: string;
  budget: string;
  paymentMethod: string;
  message: string;
}

type FieldErrors = Partial<Record<'name' | 'phone' | 'email' | 'city' | 'vehicle' | 'year', string>>;

const initialValues: FormValues = {
  name: '',
  phone: '',
  email: '',
  city: '',
  brand: '',
  model: '',
  year: '',
  budget: '',
  paymentMethod: '',
  message: '',
};

/** Vérifie les champs et renvoie les messages d'erreur. */
function validate(v: FormValues, t: FormT): FieldErrors {
  const errors: FieldErrors = {};
  if (v.name.trim().length < 2) errors.name = t.errors.name;
  // Au moins 8 chiffres (numéros sénégalais à 9 chiffres, canadiens à 10, avec ou sans indicatif)
  const digits = v.phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15 || /[^\d\s+().-]/.test(v.phone)) errors.phone = t.errors.phone;
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = t.errors.email;
  if (v.city.trim().length < 2) errors.city = t.errors.city;
  if (!v.brand.trim() && !v.model.trim()) errors.vehicle = t.errors.vehicle;
  const year = Number(v.year);
  const maxYear = new Date().getFullYear() + 1;
  if (v.year && (!/^\d{4}$/.test(v.year) || year < 1980 || year > maxYear)) errors.year = t.errors.year;
  return errors;
}

/** Construit le texte de la demande (WhatsApp et email). */
function buildMessage(v: FormValues, t: FormT) {
  const vehicle = [v.brand, v.model, v.year].map((s) => s.trim()).filter(Boolean).join(' ');
  const lines: Array<[string, string]> = [
    [t.name, v.name],
    [t.phone, v.phone],
    [t.email, v.email],
    [t.city, v.city],
    [t.vehicleGroup, vehicle],
    [t.budget, v.budget ? formatFCFA(Number(v.budget)) : ''],
    [t.paymentMethod, v.paymentMethod],
    [t.message, v.message],
  ];
  return [
    t.messageTitle,
    '',
    ...lines.filter(([, value]) => value.trim()).map(([label, value]) => `• ${label} : ${value.trim()}`),
  ].join('\n');
}

/**
 * Formulaire de devis : à l'envoi, ouvre WhatsApp avec un message pré-rempli
 * (aucun serveur nécessaire). Option secondaire : envoi par email (mailto).
 */
/** Ordre d'affichage des erreurs, et champ à atteindre pour chacune. */
const ERROR_ORDER: Array<keyof FieldErrors> = ['name', 'phone', 'email', 'city', 'vehicle', 'year'];
const ERROR_FIELD: Record<keyof FieldErrors, keyof FormValues> = {
  name: 'name',
  phone: 'phone',
  email: 'email',
  city: 'city',
  vehicle: 'brand',
  year: 'year',
};

export function ContactForm({ t }: { t: FormT }) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  // Champs déjà quittés par le visiteur : leurs erreurs s'affichent dès la sortie du champ
  const [touched, setTouched] = useState<Partial<Record<keyof FieldErrors, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [sent, setSent] = useState(false);

  // Erreurs affichées : tous les champs après une tentative d'envoi, sinon seulement les champs quittés
  const allErrors = validate(values, t);
  const errors: FieldErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([key]) => submitted || touched[key as keyof FieldErrors]),
  );
  const errorKeys = ERROR_ORDER.filter((key) => errors[key]);

  // Après un envoi refusé, le focus va sur le récapitulatif des erreurs
  useEffect(() => {
    if (failedAttempts === 0) return;
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    summaryRef.current?.focus({ preventScroll: true });
  }, [failedAttempts]);

  const update = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (field === 'budget') value = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11);
    if (field === 'year') value = value.replace(/\D/g, '').slice(0, 4);
    setValues({ ...values, [field]: value });
    setSent(false);
  };

  /** Marque un champ comme « quitté » pour afficher son erreur éventuelle. */
  const touch = (key?: keyof FieldErrors) => () => {
    if (key && !touched[key]) setTouched({ ...touched, [key]: true });
  };

  /** Valide le formulaire ; en cas d'erreur, affiche le récapitulatif. */
  const check = () => {
    setSubmitted(true);
    if (Object.keys(allErrors).length > 0) {
      setFailedAttempts((n) => n + 1);
      return false;
    }
    return true;
  };

  /** Lien du récapitulatif : amène le curseur dans le champ concerné. */
  const goToField = (key: keyof FieldErrors) => (e: React.MouseEvent) => {
    e.preventDefault();
    const field = formRef.current?.querySelector<HTMLElement>(`[name="${ERROR_FIELD[key]}"]`);
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field?.focus({ preventScroll: true });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!check()) return;
    const url = whatsappLink(buildMessage(values, t));
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
    setSent(true);
  };

  const onEmail = () => {
    if (!check()) return;
    const subject = fill(t.emailSubject, { name: values.name.trim() });
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage(values, t))}`;
  };

  const showSummary = submitted && errorKeys.length > 0;
  const budgetDisplay = values.budget.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  /** Propriétés communes d'un champ (accessibilité + style d'erreur). */
  const fieldProps = (name: keyof FormValues, errorKey?: keyof FieldErrors, helpId?: string) => {
    const error = errorKey ? errors[errorKey] : undefined;
    const describedBy = [helpId, error && `contact-${errorKey}-error`].filter(Boolean).join(' ');
    return {
      id: `contact-${name}`,
      name,
      value: name === 'budget' ? budgetDisplay : values[name],
      onChange: update(name),
      // Le véhicule (marque OU modèle) n'est vérifié qu'en quittant le champ « Modèle »
      onBlur: touch(errorKey === 'vehicle' && name === 'brand' ? undefined : errorKey),
      'aria-invalid': error ? (true as const) : undefined,
      'aria-describedby': describedBy || undefined,
      className: cn('field', error && 'field-error'),
    };
  };

  const ErrorText = ({ id }: { id: keyof FieldErrors }) =>
    errors[id] ? (
      <p id={`contact-${id}-error`} className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {errors[id]}
      </p>
    ) : null;

  const Optional = () => <span className="font-normal text-slate-500"> ({t.optional})</span>;
  const Required = () => (
    <span className="text-red-600" aria-hidden="true">
      {' '}
      *
    </span>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card p-6 md:p-8">
      {/* Récapitulatif des erreurs : reçoit le focus après un envoi refusé, chaque ligne mène au champ */}
      {showSummary && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="contact-error-summary-title"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <p id="contact-error-summary-title" className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {fill(t.errors.summaryTitle, { count: errorKeys.length })}
          </p>
          <ul className="mt-2 space-y-1 pl-6">
            {errorKeys.map((key) => (
              <li key={key} className="list-disc">
                <a href={`#contact-${ERROR_FIELD[key]}`} onClick={goToField(key)} className="underline underline-offset-2 hover:text-red-950">
                  {errors[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            {t.name}
            <Required />
          </label>
          <input type="text" autoComplete="name" required placeholder={t.placeholders.name} {...fieldProps('name', 'name')} />
          <ErrorText id="name" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="field-label">
            {t.phone}
            <Required />
          </label>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder={t.placeholders.phone}
            {...fieldProps('phone', 'phone', 'contact-phone-help')}
          />
          <p id="contact-phone-help" className="mt-1.5 text-xs text-slate-500">
            {t.phoneHelp}
          </p>
          <ErrorText id="phone" />
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            {t.email}
            <Optional />
          </label>
          <input type="email" autoComplete="email" inputMode="email" placeholder={t.placeholders.email} {...fieldProps('email', 'email')} />
          <ErrorText id="email" />
        </div>
        <div>
          <label htmlFor="contact-city" className="field-label">
            {t.city}
            <Required />
          </label>
          <input type="text" autoComplete="address-level2" required placeholder={t.placeholders.city} {...fieldProps('city', 'city')} />
          <ErrorText id="city" />
        </div>
      </div>

      {/* Véhicule souhaité */}
      <fieldset className="mt-6 rounded-2xl border border-ink-900/10 p-4 md:p-5">
        <legend className="px-2 text-sm font-semibold text-ink-900">
          {t.vehicleGroup}
          <Required />
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="contact-brand" className="field-label">
              {t.brand}
            </label>
            <input type="text" placeholder={t.placeholders.brand} {...fieldProps('brand', 'vehicle')} />
          </div>
          <div>
            <label htmlFor="contact-model" className="field-label">
              {t.model}
            </label>
            <input type="text" placeholder={t.placeholders.model} {...fieldProps('model', 'vehicle')} />
          </div>
          <div>
            <label htmlFor="contact-year" className="field-label">
              {t.year}
            </label>
            <input type="text" inputMode="numeric" placeholder={t.placeholders.year} {...fieldProps('year', 'year')} />
          </div>
        </div>
        <ErrorText id="vehicle" />
        <ErrorText id="year" />
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-budget" className="field-label">
            {t.budget}
            <Optional />
          </label>
          <div className="relative">
            <input type="text" inputMode="numeric" placeholder={t.placeholders.budget} {...fieldProps('budget')} className="field pr-16" />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-500">FCFA</span>
          </div>
        </div>
        <div>
          <label htmlFor="contact-paymentMethod" className="field-label">
            {t.paymentMethod}
            <Optional />
          </label>
          <select {...fieldProps('paymentMethod')}>
            <option value="">{t.paymentPlaceholder}</option>
            {siteConfig.payment.methods.map((method) => (
              <option key={method.id} value={method.name}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="field-label">
          {t.message}
          <Optional />
        </label>
        <textarea rows={4} placeholder={t.placeholders.message} {...fieldProps('message')} className="field resize-y" />
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-whatsapp flex-1 text-base">
          <WhatsAppIcon className="h-5 w-5" />
          {t.submit}
        </button>
        <button type="button" onClick={onEmail} className="btn-outline sm:w-auto">
          <Mail className="h-4 w-4" aria-hidden="true" />
          {t.submitEmail}
        </button>
      </div>

      <AnimatePresence>
        {sent && (
          <m.p
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {t.success}
          </m.p>
        )}
      </AnimatePresence>
    </form>
  );
}
