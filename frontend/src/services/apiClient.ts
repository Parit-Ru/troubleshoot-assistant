const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Thin wrapper around fetch(), shared by every service file. Centralizing
 * this means: one place to attach the JWT header later (Phase 6), one
 * place to handle non-2xx responses consistently, and one place to read
 * the base URL from .env — no service file talks to `fetch` directly.
 */
async function request<TResponse>(
  path: string,
  options?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Authorization header will be added here once auth exists (Phase 6)
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<TResponse>;
}

export const apiClient = {
  get: <TResponse>(path: string) => request<TResponse>(path),
  post: <TResponse>(path: string, body: unknown) =>
    request<TResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  delete: <TResponse>(path: string) =>
    request<TResponse>(path, { method: "DELETE" }),
};