import { API_BASE_URL } from '@/constants/config';

export interface RequestOptions {
  token?: string;
  body?: unknown;
  method?: 'GET' | 'POST';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Set EXPO_PUBLIC_API_URL to your backend address before connecting.');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
  } catch {
    throw new Error(`Could not reach ${API_BASE_URL}. Check the API URL and that your device can access the backend.`);
  }

  let payload: unknown;
  try {
    const responseText = await response.text();
    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = responseText.trim();
      }
    }
  } catch {
    payload = undefined;
  }

  const envelope = isRecord(payload) ? payload : undefined;
  if (!response.ok || envelope?.success === false) {
    const bodyMessage =
      typeof envelope?.message === 'string'
        ? envelope.message
        : typeof envelope?.error === 'string'
          ? envelope.error
          : typeof payload === 'string' && payload.length < 300 && !payload.includes('<html')
            ? payload
            : undefined;
    const operation = `${options.method ?? 'GET'} ${path}`;
    throw new Error(bodyMessage ? `${bodyMessage} (${response.status})` : `${operation} failed with HTTP ${response.status}.`);
  }

  if (envelope && 'data' in envelope) return envelope.data as T;
  return payload as T;
}