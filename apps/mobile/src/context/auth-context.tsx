import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type Profile,
  type User,
  forgotPasswordApi,
  getSessionApi,
  resetPasswordApi,
  signInApi,
  signOutApi,
  signUpApi,
  socialSignInApi,
} from '@/lib/auth-api';
import { getAuthToken, removeAuthToken, saveAuthToken } from '@/lib/secure-store';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signUp: (data: { name?: string; email: string; password: string }) => Promise<void>;
  signIn: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  socialSignIn: (
    provider: 'google' | 'apple',
    body: { idToken?: string; nonce?: string; accessToken?: string },
  ) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (newPassword: string, token: string) => Promise<{ message: string }>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = async () => {
    try {
      const storedToken = await getAuthToken();
      if (!storedToken) {
        setUser(null);
        setProfile(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      const sessionData = await getSessionApi(storedToken);
      setUser(sessionData.user);
      setProfile(sessionData.profile);
    } catch {
      await removeAuthToken();
      setUser(null);
      setProfile(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signUp = async (data: { name?: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signUpApi(data);
      setToken(res.token);
      setUser(res.user);
      await saveAuthToken(res.token);
      // Fetch full session to load profile if available
      try {
        const session = await getSessionApi(res.token);
        setProfile(session.profile);
      } catch {
        setProfile(null);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: { email: string; password: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signInApi(data);
      setToken(res.token);
      setUser(res.user);
      await saveAuthToken(res.token);
      try {
        const session = await getSessionApi(res.token);
        setProfile(session.profile);
      } catch {
        setProfile(null);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const socialSignIn = async (
    provider: 'google' | 'apple',
    body: { idToken?: string; nonce?: string; accessToken?: string },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await socialSignInApi(provider, body);
      setToken(res.token);
      setUser(res.user);
      await saveAuthToken(res.token);
      try {
        const session = await getSessionApi(res.token);
        setProfile(session.profile);
      } catch {
        setProfile(null);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Social sign in with ${provider} failed`;
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    if (token) {
      try {
        await signOutApi(token);
      } catch {
        // Continue clearing state even if endpoint call fails
      }
    }
    await removeAuthToken();
    setToken(null);
    setUser(null);
    setProfile(null);
    setError(null);
    setIsLoading(false);
  };

  const forgotPassword = async (email: string) => {
    setError(null);
    try {
      return await forgotPasswordApi({ email });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset request failed';
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (newPassword: string, resetToken: string) => {
    setError(null);
    try {
      return await resetPasswordApi({ newPassword, token: resetToken });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        error,
        signUp,
        signIn,
        socialSignIn,
        signOut,
        forgotPassword,
        resetPassword,
        refreshSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
