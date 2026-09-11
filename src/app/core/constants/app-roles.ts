export const APP_ROLES = {
  admin: 'Admin',
  customer: 'Customer'
} as const;

export type AppRole =
  typeof APP_ROLES[keyof typeof APP_ROLES];