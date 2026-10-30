const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const KEY = 'uho_auth';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Usuario o contraseña incorrectos.');
  const data = await response.json();
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function logout() {
  localStorage.removeItem(KEY);
}

async function refreshAccess() {
  const session = getSession();
  if (!session?.refresh) return false;
  const response = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: session.refresh }),
  });
  if (!response.ok) return false;
  const data = await response.json();
  localStorage.setItem(KEY, JSON.stringify({ ...session, access: data.access }));
  return true;
}

export async function authFetch(path, options = {}) {
  const send = () => {
    const session = getSession();
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(session ? { Authorization: `Bearer ${session.access}` } : {}),
      },
    });
  };

  let response = await send();
  if (response.status === 401 && (await refreshAccess())) {
    response = await send();
  }
  if (response.status === 401) {
    logout();
    window.location.reload();
  }
  return response;
}

export async function apiFetch(path, options = {}) {
  const response = await authFetch(path, options);
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || `La operación falló (HTTP ${response.status}).`);
  return data;
}
