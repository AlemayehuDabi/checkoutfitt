export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Profile {
  id: string;
  userId: string;
  genderPresentation?: string | null;
  stylePreferences?: string[];
  sizeTop?: string | null;
  sizeBottom?: string | null;
  sizeShoe?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionResponse {
  user: User | null;
  profile: Profile | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class AuthApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message =
      Array.isArray(data.message)
        ? data.message.join(', ')
        : (data.message as string) || (data.error as string) || `Request failed with status ${res.status}`;
    throw new AuthApiError(message, res.status);
  }

  return data as T;
}

export async function signUpApi(body: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<AuthResponse>(res);
}

export async function signInApi(body: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<AuthResponse>(res);
}

export async function socialSignInApi(
  provider: 'google' | 'apple',
  body: { idToken?: string; nonce?: string; accessToken?: string },
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/social/${provider}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<AuthResponse>(res);
}

export async function signOutApi(token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/auth/sign-out`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<{ success: boolean }>(res);
}

export async function forgotPasswordApi(body: {
  email: string;
}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<{ message: string }>(res);
}

export async function resetPasswordApi(body: {
  newPassword: string;
  token: string;
}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<{ message: string }>(res);
}

export async function getSessionApi(token: string): Promise<SessionResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<SessionResponse>(res);
}
