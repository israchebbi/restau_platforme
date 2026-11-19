import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api, setAuthToken, setUnauthorizedHandler } from "../api/client";
import type { AuthResponse, User } from "../types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  ready: boolean; // true once the stored session has been read
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  async function startSession({ user, token }: AuthResponse) {
    if (user.role !== "CLIENT") {
      throw new Error(
        "This app is for clients. Restaurants use the dashboard and drivers use the driver app."
      );
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    setAuthToken(token);
    set({ user, token });
  }

  return {
    user: null,
    token: null,
    ready: false,

    hydrate: async () => {
      try {
        const [token, rawUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (token && rawUser) {
          setAuthToken(token);
          set({ token, user: JSON.parse(rawUser) as User });
        }
      } catch {
        // unreadable storage: start signed out
      } finally {
        set({ ready: true });
      }
    },

    login: async (email, password) => {
      const { data } = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      await startSession(data);
    },

    register: async (input) => {
      const { data } = await api.post<AuthResponse>("/api/auth/register", input);
      await startSession(data);
    },

    logout: async () => {
      setAuthToken(null);
      set({ user: null, token: null });
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    },
  };
});

// An expired token signs the user out
setUnauthorizedHandler(() => {
  void useAuthStore.getState().logout();
});