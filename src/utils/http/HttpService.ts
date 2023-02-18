import { AjaxError } from "./AjaxError";
import { Options } from "./Options";

export class HttpService {
  private static defaultOptions: Options = {
    responseType: "json",
  };

  constructor(private readonly options: Options) {
    this.options = { ...HttpService.defaultOptions, ...this.options };
  }

  public get<R = unknown>(url: string, options?: Options): Promise<R> {
    return this.buildHttpMethod<R>(url, options, (opt) => ({
      method: "GET",
      headers: opt.headers,
      signal: opt.signal,
    }));
  }

  public delete<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.buildHttpMethod<R>(url, options, (opt) => ({
      headers: opt.headers,
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
      signal: opt.signal,
    }));
  }

  public post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Options
  ) {
    return this.buildHttpMethod<R>(url, options, (opt) => ({
      headers: opt.headers,
      method: "POST",
      body: JSON.stringify(body),
      signal: opt.signal,
    }));
  }

  public put<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ) {
    return this.buildHttpMethod<R>(url, options, (opt) => ({
      headers: opt.headers,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      signal: opt.signal,
    }));
  }

  public patch<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ) {
    return this.buildHttpMethod<R>(url, options, (opt) => ({
      headers: opt.headers,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      signal: opt.signal,
    }));
  }

  private buildHttpMethod<R>(
    url: string,
    options: Options = {},
    mapOptionsToFetchOpt: (options: Options) => RequestInit
  ): Promise<R> {
    const allOptions = { ...this.options, ...options };
    // secure correct endpoint
    const endpoint: string = this.parse(allOptions.host, url);
    const fetchOptions = mapOptionsToFetchOpt(allOptions);

    return fetch(endpoint, fetchOptions).then((response) => {
      if (!response.ok) {
        return response.text().then((rawResponse) => {
          try {
            const jsonResponse = JSON.parse(rawResponse);
            throw new AjaxError(response.status, jsonResponse, fetchOptions);
          } catch (e) {
            if (e instanceof AjaxError) {
              throw e;
            }
            throw new AjaxError(response.status, rawResponse, fetchOptions);
          }
        });
      }
      return response[allOptions.responseType!]().catch((err) => {
        // API zwraca response z nagłówkiem content-type: application/json, ale
        // response często jest pusty lub czasem jest stringiem
        // poniższy kod ignoruje takie sytuacje, ale nie jest to dobre rozwiązanie
        if (response.status === 204) {
          return {};
        }
        if (err.message?.includes("JSON")) {
          return {};
        }
        throw err;
      });
    });
  }

  private parse(host: string | undefined, url: string) {
    if (host === undefined) {
      return url;
    }

    const parsedHost = host.charAt(host.length - 1) !== "/" ? `${host}/` : host;
    const parsedUrl = url.charAt(0) === "/" ? url.substring(1) : url;

    return `${parsedHost}${parsedUrl}`;
  }
}
