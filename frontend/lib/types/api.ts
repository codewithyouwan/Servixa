/**
 * API envelope types — must match the FastAPI response conventions
 * defined in docs/architecture/03-api-architecture.md:
 *   success: { data, meta? }   error: { error: { code, message } }
 */

export interface ApiMeta {
  cursor?: string | null;
  total?: number;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: ApiMeta;
}

/**
 * FastAPI wraps HTTPException(detail=...) as {"detail": <detail>} — every
 * router in this app passes detail={"error": {code, message}}, so the raw
 * response body is {"detail": {"error": {...}}}, not {"error": {...}} at
 * the top level.
 */
export interface ApiErrorBody {
  detail: { error: { code: string; message: string } };
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Query params appended to the URL. */
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

/**
 * Transport abstraction: the mock adapter (today) and the HTTP adapter
 * (FastAPI, later) both implement this. Services depend only on this.
 */
export interface ApiTransport {
  request<T>(path: string, options?: RequestOptions): Promise<ApiSuccess<T>>;
}
