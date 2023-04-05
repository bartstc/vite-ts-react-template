export type FetchOptions = {
  host?: string;
  cache?: RequestCache;
  headers?: HeadersInit;
  responseType?: "json" | "text" | "arrayBuffer" | "blob" | "formData";
  signal?: AbortSignal;
};
