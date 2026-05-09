export async function customFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null;

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}