import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please log in again.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
