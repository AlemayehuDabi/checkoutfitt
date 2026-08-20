"use client";

import * as React from "react";
import {
  User,
  Profile,
  signInApi,
  signUpApi,
  socialSignInApi,
  signOutApi,
  forgotPasswordApi,
  resetPasswordApi,
  getSessionApi,
} from "./auth-api";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: Parameters<typeof signInApi>[0]) => Promise<void>;
  signUp: (data: Parameters<typeof signUpApi>[0]) => Promise<void>;
  socialSignIn: (
    provider: "google" | "apple",
    body: Parameters<typeof socialSignInApi>[1],
  ) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (data: Parameters<typeof forgotPasswordApi>[0]) => Promise<{ message: string }>;
  resetPassword: (data: Parameters<typeof resetPasswordApi>[0]) => Promise<{ message: string }>;
  refreshSession: () => Promise<void>;
}

const TOKEN_KEY = "checkoutfitt_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=2592000; SameSite=Lax`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshSession = React.useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setProfile(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const session = await getSessionApi(currentToken);
      if (session.user) {
        setUser(session.user);
        setProfile(session.profile);
        setToken(currentToken);
      } else {
        setStoredToken(null);
        setUser(null);
        setProfile(null);
        setToken(null);
      }
    } catch {
      setStoredToken(null);
      setUser(null);
      setProfile(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isSubscribed = true;
    const init = async () => {
      const currentToken = getStoredToken();
      if (!currentToken) {
        if (isSubscribed) {
          setUser(null);
          setProfile(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const session = await getSessionApi(currentToken);
        if (isSubscribed) {
          if (session.user) {
            setUser(session.user);
            setProfile(session.profile);
            setToken(currentToken);
          } else {
            setStoredToken(null);
            setUser(null);
            setProfile(null);
            setToken(null);
          }
        }
      } catch {
        if (isSubscribed) {
          setStoredToken(null);
          setUser(null);
          setProfile(null);
          setToken(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    void init();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const signIn = React.useCallback(async (data: Parameters<typeof signInApi>[0]) => {
    const res = await signInApi(data);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    try {
      const session = await getSessionApi(res.token);
      setProfile(session.profile);
    } catch {
      // keep existing user
    }
  }, []);

  const signUp = React.useCallback(async (data: Parameters<typeof signUpApi>[0]) => {
    const res = await signUpApi(data);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    try {
      const session = await getSessionApi(res.token);
      setProfile(session.profile);
    } catch {
      // keep existing user
    }
  }, []);

  const socialSignIn = React.useCallback(
    async (
      provider: "google" | "apple",
      body: Parameters<typeof socialSignInApi>[1],
    ) => {
      const res = await socialSignInApi(provider, body);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      try {
        const session = await getSessionApi(res.token);
        setProfile(session.profile);
      } catch {
        // keep user
      }
    },
    [],
  );

  const signOut = React.useCallback(async () => {
    const currentToken = token || getStoredToken();
    if (currentToken) {
      try {
        await signOutApi(currentToken);
      } catch {
        // ignore sign out API failure and clear client session anyway
      }
    }
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setProfile(null);
  }, [token]);

  const forgotPassword = React.useCallback(
    async (data: Parameters<typeof forgotPasswordApi>[0]) => {
      return await forgotPasswordApi(data);
    },
    [],
  );

  const resetPassword = React.useCallback(
    async (data: Parameters<typeof resetPasswordApi>[0]) => {
      return await resetPasswordApi(data);
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      user,
      profile,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      socialSignIn,
      signOut,
      forgotPassword,
      resetPassword,
      refreshSession,
    }),
    [
      user,
      profile,
      token,
      isLoading,
      signIn,
      signUp,
      socialSignIn,
      signOut,
      forgotPassword,
      resetPassword,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
