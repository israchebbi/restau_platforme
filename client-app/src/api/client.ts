import axios from "axios";

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// Expired token or blocked account: sign the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isAuthRoute = error.config?.url?.includes("/api/auth/");

    if (!isAuthRoute && (status === 401 || message === "Account blocked")) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Cannot reach the server. Check your connection.";
    }
    const data = error.response.data;
    const issue = data?.errors?.[0];
    if (issue) return `${issue.path?.join(".") ?? "Field"}: ${issue.message}`;
    return data?.message ?? "Something went wrong";
  }
  return error instanceof Error ? error.message : "Something went wrong";
}