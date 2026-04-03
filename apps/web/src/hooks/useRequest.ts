import { useAuth } from '@clerk/react';
import { useCallback } from 'react';
import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface RequestConfig {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
}

export async function makeRequest<S extends z.ZodType>(
  getToken: (() => Promise<string | null>) | null,
  config: RequestConfig,
  schema: S,
): Promise<z.infer<S>> {
  const headers: Record<string, string> = {};
  if (config.data !== undefined) headers['Content-Type'] = 'application/json';
  if (getToken) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${config.url}`, {
    method: config.method,
    headers,
    body: config.data !== undefined ? JSON.stringify(config.data) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const text = await res.text();
  return schema.parse(text ? JSON.parse(text) : null);
}

export default function useRequest() {
  const { isSignedIn, getToken } = useAuth();
  return useCallback(
    <S extends z.ZodType>(config: RequestConfig, schema: S) =>
      makeRequest(isSignedIn ? getToken : null, config, schema),
    [getToken, isSignedIn],
  );
}
