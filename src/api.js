const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error('Could not reach the gallery. Check that the API server is running.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.errors?.[0]?.message || 'Something went wrong.');
  }
  return payload;
}

export const api = {
  listPhotos(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, value);
    });
    return request(`/photos${query.size ? `?${query}` : ''}`);
  },
  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register(details) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });
  },
  me(token) {
    return request('/auth/me', { token });
  },
  uploadPhoto(token, formData) {
    return request('/photos', {
      token,
      method: 'POST',
      body: formData,
    });
  },
};
