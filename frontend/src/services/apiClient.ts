const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<TResponse>(
  path: string,
  options?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // <-- ADD THIS: sends/receives httpOnly cookies
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