function parseJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalized = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export function getCurrentCustomerId(): number | null {
  const directId = localStorage.getItem('customerId');

  if (directId) {
    const id = Number(directId);

    if (!Number.isNaN(id)) {
      return id;
    }
  }

  const token =
    localStorage.getItem('token') ??
    localStorage.getItem('accessToken') ??
    localStorage.getItem('authToken');

  if (!token) {
    return null;
  }

  const payload = parseJwt(token);

  if (!payload) {
    return null;
  }

  const value =
    payload.customerId ??
    payload.nameid ??
    payload.sub ??
    payload[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ];

  if (!value) {
    return null;
  }

  const id = Number(value);

  return Number.isNaN(id) ? null : id;
}