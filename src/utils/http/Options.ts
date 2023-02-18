export type Options = {
  host?: string;
  headers?: HeadersInit;
  responseType?: "json" | "text" | "arrayBuffer" | "blob" | "formData";
  signal?: AbortSignal;
};
