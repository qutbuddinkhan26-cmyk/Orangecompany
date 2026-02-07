const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type FetchOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
};

type ApiError = {
  message: string;
  status?: number;
};

const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = auth ? getAuthToken() : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'string'
        ? payload
        : payload?.message || 'Request failed';
    const error: ApiError = { message, status: response.status };
    throw error;
  }

  return payload as T;
}

export const getServices = () => fetchApi('/services', { method: 'GET' });

export const getServiceById = (id: string) =>
  fetchApi(`/services/${id}`, { method: 'GET' });

export const createBooking = (data: {
  serviceId: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
}) => fetchApi('/bookings', { method: 'POST', body: data });

export const login = (data: { email: string; password: string }) =>
  fetchApi('/auth/login', { method: 'POST', body: data, auth: false });

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => fetchApi('/auth/register', { method: 'POST', body: data, auth: false });

export const getUserProfile = () => fetchApi('/users/profile', { method: 'GET' });

export const updateUserProfile = (data: {
  name?: string;
  phone?: string;
  address?: string;
}) => fetchApi('/users/profile', { method: 'PUT', body: data });

export { fetchApi };
