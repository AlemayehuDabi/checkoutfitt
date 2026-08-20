import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'checkoutfitt_auth_token';

// In-memory fallback for non-native environments (like web) where SecureStore is unavailable
const memoryStore = new Map<string, string>();

export async function saveAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        memoryStore.set(AUTH_TOKEN_KEY, token);
      }
    } catch {
      memoryStore.set(AUTH_TOKEN_KEY, token);
    }
    return;
  }

  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.warn('SecureStore save failed, falling back to memory store:', error);
    memoryStore.set(AUTH_TOKEN_KEY, token);
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(AUTH_TOKEN_KEY);
      }
      return memoryStore.get(AUTH_TOKEN_KEY) || null;
    } catch {
      return memoryStore.get(AUTH_TOKEN_KEY) || null;
    }
  }

  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('SecureStore read failed, falling back to memory store:', error);
    return memoryStore.get(AUTH_TOKEN_KEY) || null;
  }
}

export async function removeAuthToken(): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      memoryStore.delete(AUTH_TOKEN_KEY);
    } catch {
      memoryStore.delete(AUTH_TOKEN_KEY);
    }
    return;
  }

  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('SecureStore delete failed:', error);
  }
  memoryStore.delete(AUTH_TOKEN_KEY);
}
