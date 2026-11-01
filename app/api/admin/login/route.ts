import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE, checkCredentials, createSessionValue, isAuthConfigured } from '@/lib/admin-auth';

/** Connexion au backoffice avec le numéro de téléphone et le mot de passe. */
export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: 'Backoffice non configuré : ajoutez ADMIN_PHONE et ADMIN_PASSWORD sur Vercel.' },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const phone = typeof body.phone === 'string' ? body.phone : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!checkCredentials(phone, password)) {
    // Ralentit les essais de mots de passe en série
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ error: 'Numéro ou mot de passe incorrect.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
