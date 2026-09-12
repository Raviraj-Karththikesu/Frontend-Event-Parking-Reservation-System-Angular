function parseJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalized = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded =
      normalized +
      '='.repeat((4 - normalized.length % 4) % 4);

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getCurrentCustomerId(): number | null {

  // Current project authentication session
  const storedSession =
    localStorage.getItem('eventParkingAuth');

  if (storedSession) {
    try {
      const session =
        JSON.parse(storedSession);

      const customerId =
        Number(session?.customerId);

      if (
        Number.isFinite(customerId) &&
        customerId > 0
      ) {
        return customerId;
      }

      // Fallback: read customer id from JWT
      if (session?.accessToken) {
        const payload =
          parseJwt(session.accessToken);

        const value =
          payload?.customerId ??
          payload?.nameid ??
          payload?.sub ??
          payload?.[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
          ];

        const tokenCustomerId =
          Number(value);

        if (
          Number.isFinite(tokenCustomerId) &&
          tokenCustomerId > 0
        ) {
          return tokenCustomerId;
        }
      }

    } catch {
      return null;
    }
  }

  // Backward-compatible fallback
  const directId =
    localStorage.getItem('customerId');

  if (directId) {
    const id = Number(directId);

    if (
      Number.isFinite(id) &&
      id > 0
    ) {
      return id;
    }
  }

  return null;
}