// Akun Japri + dompet koin (backend Japri Konten).
// Gemini TIDAK dipanggil langsung dari browser lagi: semua lewat {API_BASE}/api/js/gemini,
// server yang memegang key dan memotong koin. Lihat dashboard/routes/japri_studio_routes.py.

export const API_BASE = (import.meta.env.VITE_JAPRI_API_URL || 'https://konten.japri.web.id').replace(/\/+$/, '');
export const GEMINI_PROXY_BASE = `${API_BASE}/api/js/gemini`;

const TOKEN_KEY = 'japri_studio_token';

export interface JapriUser {
  username: string;
  email: string;
  balance: number;
  paid_balance: number;
  free_left: number;
  daily_free: number;
  own_key: boolean;
  prices: { image: number; text: number };
  wallet_url: string;
  register_url: string;
}

export class JapriApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function setToken(token: string) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // mode privat: token hanya hidup selama tab terbuka
  }
}

async function call(path: string, init: RequestInit = {}): Promise<any> {
  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...(init.headers || {}),
      },
    });
  } catch {
    throw new JapriApiError('Tidak bisa terhubung ke server Japri. Cek koneksi internet lalu coba lagi.', 0, 'NETWORK');
  }
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const err = data?.error || {};
    throw new JapriApiError(err.message || `Server error ${resp.status}`, resp.status, err.status);
  }
  return data;
}

export async function login(identifier: string, password: string): Promise<JapriUser> {
  const data = await call('/api/js/login', { method: 'POST', body: JSON.stringify({ identifier, password }) });
  setToken(data.token);
  return data.user;
}

export async function fetchMe(): Promise<JapriUser> {
  const data = await call('/api/js/me');
  return data.user;
}

export function logout() {
  setToken('');
}

// Event dari geminiService → App (saldo habis / sesi habis / perlu refresh saldo).
export const JAPRI_EVENT = 'japri:api';
export type JapriEventDetail = { type: 'insufficient' | 'unauthenticated' | 'used'; message?: string };

export function emitJapri(detail: JapriEventDetail) {
  window.dispatchEvent(new CustomEvent<JapriEventDetail>(JAPRI_EVENT, { detail }));
}
