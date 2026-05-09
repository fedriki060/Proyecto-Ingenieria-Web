const API_URL = 'http://localhost:5070';

function getToken(): string | null {
  const user = localStorage.getItem('currentUser');
  if (!user) return null;
  try {
    return JSON.parse(user).token;
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

// ─── Auth ─────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; email: string; nombreCompleto: string; rol: string; expiracion: string }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  register: (email: string, password: string, nombreCompleto: string, rol: string) =>
    request<{ token: string; email: string; nombreCompleto: string; rol: string; expiracion: string }>(
      '/api/auth/register',
      { method: 'POST', body: JSON.stringify({ email, password, nombreCompleto, rol }) }
    ),

  me: () =>
    request<{ userId: string; email: string; nombre: string; rol: string }>('/api/auth/me'),
};

// ─── Salas ────────────────────────────────────────────────────────
export const salasApi = {
  getAll: () =>
    request<any[]>('/api/salas'),

  getById: (id: number) =>
    request<any>(`/api/salas/${id}`),

  search: (tipo?: string, capacidadMinima?: number) => {
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (capacidadMinima) params.append('capacidadMinima', String(capacidadMinima));
    return request<any[]>(`/api/salas/search?${params}`);
  },

  create: (data: any) =>
    request<any>('/api/salas', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: any) =>
    request<any>(`/api/salas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`/api/salas/${id}`, { method: 'DELETE' }),
};

// ─── Reservas ─────────────────────────────────────────────────────
export const reservasApi = {
  getAll: () =>
    request<any[]>('/api/reservas'),

  getMias: () =>
    request<any[]>('/api/reservas/mis-reservas'),

  getById: (id: number) =>
    request<any>(`/api/reservas/${id}`),

  create: (data: { salaId: number; fechaInicio: string; fechaFin: string; proposito: string }) =>
    request<any>('/api/reservas', { method: 'POST', body: JSON.stringify(data) }),

  cambiarEstado: (id: number, estado: string, comentarioStaff?: string) =>
    request<any>(`/api/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado, comentarioStaff }),
    }),

  registrarNoShow: (id: number) =>
    request<void>(`/api/reservas/${id}/no-show`, { method: 'PATCH' }),

  cancelar: (id: number) =>
    request<void>(`/api/reservas/${id}`, { method: 'DELETE' }),
};