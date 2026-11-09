import { useState } from "react";
import type { ReactNode } from "react";
import { api, TOKEN_KEY, USER_KEY } from "../lib/api";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw && localStorage.getItem(TOKEN_KEY)
      ? (JSON.parse(raw) as User)
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  async function login(email: string, password: string) {
    const { data } = await api.post<{ user: User; token: string }>(
      "/api/auth/login",
      { email, password }
    );
    if (data.user.role !== "SUPER_ADMIN" && data.user.role !== "RESTAURANT") {
      throw new Error("This dashboard is for restaurants and administrators only");
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}