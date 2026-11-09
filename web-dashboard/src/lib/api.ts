import axios from "axios";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired or invalid token: log out and go back to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes("/api/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "Cannot reach the server";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}