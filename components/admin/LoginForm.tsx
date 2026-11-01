'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';
import { Logo } from '@/components/Logo';

/** Formulaire de connexion au backoffice (numéro de téléphone + mot de passe). */
export function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      if (res.ok) {
        window.location.href = '/admin/';
        return;
      }
      setError((await res.json().catch(() => null))?.error ?? 'Connexion impossible.');
    } catch {
      setError('Pas de connexion internet.');
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo priority className="h-14" />
        </div>
        <form onSubmit={submit} className="card p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/30 text-mint-dark">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-heading text-xl font-extrabold">Espace gestion</h1>
              <p className="text-sm text-slate-500">Gérez les véhicules du site</p>
            </div>
          </div>

          <label htmlFor="phone" className="field-label">
            Numéro de téléphone
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="username"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 123 45 67"
            className="field"
          />

          <label htmlFor="password" className="field-label mt-4">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:text-ink-900"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-ink mt-6 w-full disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
