export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  customerId: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  accessToken: string;
  tokenType: string;
  expiresAt: string;
}

export interface CurrentUser {
  customerId: string | null;
  fullName: string | null;
  email: string | null;
  role: string | null;
}

export interface RegisterCustomerRequest {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  password: string;
  confirmPassword: string;
}

export interface CustomerResponse {
  customerId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateCustomerProfileRequest {
  fullName: string;
  phoneNumber: string | null;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
}