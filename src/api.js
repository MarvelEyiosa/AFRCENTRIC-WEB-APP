const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new Error('Could not reach the gallery. Check that the API server is running.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.errors?.[0]?.message || 'Something went wrong.');
    error.status = response.status;
    throw error;
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
  getPhoto(photoId) {
    return request(`/photos/${encodeURIComponent(photoId)}`);
  },
  createComment(photoId, text, token) {
    return request(`/photos/${encodeURIComponent(photoId)}/comments`, {
      method: 'POST',
      token,
      body: JSON.stringify({ text }),
    });
  },
  updateComment(commentId, text, token) {
    return request(`/photos/comments/${encodeURIComponent(commentId)}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ text }),
    });
  },
  deleteComment(commentId, token) {
    return request(`/photos/comments/${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
      token,
    });
  },
  toggleLike(photoId, token) {
    return request(`/photos/${encodeURIComponent(photoId)}/likes/toggle`, {
      method: 'POST',
      token,
    });
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
  logout(token) {
    return request('/auth/logout', {
      method: 'POST',
      token,
    });
  },
  updateProfilePicture(token, formData) {
    return request('/auth/profile-picture', {
      method: 'PATCH',
      token,
      body: formData,
    });
  },
  uploadPhoto(token, formData) {
    return request('/photos', {
      token,
      method: 'POST',
      body: formData,
    });
  },
};
