const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchBooks({ query = '', category = '', library = '', available = false, signal } = {}) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (category) params.set('categoria', category);
  if (library) params.set('biblioteca', library);
  if (available) params.set('disponibilidad', 'disponible');

  const queryString = params.toString();
  const response = await fetch(`${API_BASE}/api/v1/libros/${queryString ? `?${queryString}` : ''}`, { signal });
  if (!response.ok) throw new Error(`El catálogo no respondió (HTTP ${response.status}).`);
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  throw new Error('El formato recibido del catálogo no es válido.');
}

export async function fetchBook(bookId, { signal } = {}) {
  const response = await fetch(`${API_BASE}/api/v1/libros/${encodeURIComponent(bookId)}/`, { signal });
  if (!response.ok) throw new Error(`No se pudo cargar la ficha (HTTP ${response.status}).`);
  return response.json();
}

export async function fetchLibraries({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/v1/bibliotecas/`, { signal });
  if (!response.ok) throw new Error(`Las bibliotecas no respondieron (HTTP ${response.status}).`);
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  throw new Error('El formato recibido de bibliotecas no es válido.');
}
