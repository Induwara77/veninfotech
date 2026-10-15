import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE_NAME = 'vit_admin_session';
export const DEFAULT_ADMIN_PASSWORD = 'adminportalblog';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const SECRET_SEED =
  process.env.AUTH_SECRET || 'vit-admin-portal-super-secret-key-32chars-min';

const encoder = new TextEncoder();

/**
 * Returns CryptoKey for HMAC-SHA256 signing/verification (Web Crypto API)
 */
async function getCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET_SEED),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64(base64: string): Uint8Array {
  const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized + '==='.slice((normalized.length + 3) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Checks provided password against environment ADMIN_PASSWORD or default 'adminportalblog'
 */
export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return password.trim() === expectedPassword.trim();
}

/**
 * Creates a signed session token: <base64payload>.<base64signature>
 */
export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
  });

  const payloadBase64 = toBase64(encoder.encode(payload));
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadBase64),
  );
  const signatureBase64 = toBase64(new Uint8Array(signatureBuffer));

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies the validity and expiration of a session token
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadBase64, signatureBase64] = parts;

  try {
    const key = await getCryptoKey();
    const signatureBytes = fromBase64(signatureBase64);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as BufferSource,
      encoder.encode(payloadBase64),
    );

    if (!isValid) return false;

    const payloadJson = new TextDecoder().decode(fromBase64(payloadBase64));
    const payload = JSON.parse(payloadJson);

    if (payload.role !== 'admin' || typeof payload.exp !== 'number') {
      return false;
    }

    if (Date.now() > payload.exp) {
      return false; // Token expired
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Server Component check: returns true if admin cookie is valid
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return await verifySessionToken(token);
  } catch {
    return false;
  }
}

/**
 * Guard for Admin pages: Redirects to /admin/login if not authenticated
 */
export async function requireAdminAuth(): Promise<void> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    redirect('/admin/login');
  }
}
