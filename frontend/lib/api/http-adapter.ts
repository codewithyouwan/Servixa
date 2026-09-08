/**
 * HttpTransport — real ApiTransport for the FastAPI backend.
 * Already production-shaped: /api/v1 base, Bearer token, envelope parsing.
 * Activated by NEXT_PUBLIC_API_MODE=live.
 */

import type { ApiErrorBody, ApiSuccess, ApiTransport, RequestOptions } from "@/lib/types";
import { ApiError } from "@/lib/types";
import { authService } from "@/lib/auth";

export class HttpTransport implements ApiTransport {
  constructor(private readonly baseUrl: string) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.params ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const token = await authService.getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });

    if (!res.ok) {
      let code = "UNKNOWN";
      let message = res.statusText;
      try {
        const body = (await res.json()) as ApiErrorBody;
        code = body.detail.error.code;
        message = body.detail.error.message;
      } catch {
        // non-JSON error body — keep defaults
      }
      throw new ApiError(code, message, res.status);
    }

    return (await res.json()) as ApiSuccess<T>;
  }
}
