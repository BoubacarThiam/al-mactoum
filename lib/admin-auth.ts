/**
 * Connexion au backoffice : un seul compte, défini par les variables d'environnement
 * ADMIN_PHONE (numéro de téléphone) et ADMIN_PASSWORD (mot de passe).
 * Changer le mot de passe déconnecte automatiquement toutes les sessions ouvertes.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'am_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

const digits = (value: string) => value.replace(/\D/g, '');
const sha256 = (value: string) => createHash('sha256').update(value).digest();

function credentials() {
  const phone = digits(process.env.ADMIN_PHONE ?? '');
  const password = process.env.ADMIN_PASSWORD ?? '';
  return phone && password ? { phone, password } : null;
}

export const isAuthConfigured = () => credentials() !== null;

/** Compare sans fuite de temps (les deux valeurs sont hachées à la même longueur). */
const safeEqual = (a: string, b: string) => timingSafeEqual(sha256(a), sha256(b));

/** Le numéro est accepté avec ou sans indicatif (+221, 00221…), espaces et tirets compris. */
function samePhone(input: string, expected: string) {
  const typed = digits(input);
  if (typed.length < 8) return false;
  const short = typed.length <= expected.length ? typed : expected;
  const long = short === typed ? expected : typed;
  return long.endsWith(short);
}

export function checkCredentials(phone: string, password: string) {
  const expected = credentials();
  if (!expected) return false;
  // Les deux vérifications sont toujours faites, pour ne pas révéler laquelle a échoué
  const phoneOk = samePhone(phone, expected.phone);
  const passwordOk = safeEqual(password, expected.password);
  return phoneOk && passwordOk;
}

function sign(payload: string) {
  const { phone, password } = credentials()!;
  const key = sha256(`almactoum-admin|${phone}|${password}`);
  return createHmac('sha256', key).update(payload).digest('base64url');
}

/** Valeur du cookie de session : date d'expiration + signature. */
export function createSessionValue() {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires)}`;
}

export function isAuthenticated() {
  if (!isAuthConfigured()) return false;
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}
