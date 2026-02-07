import type { HttpServiceClient } from "./http-service-client";
import type { HttpServiceOptions } from "./http-service-options";

interface IHttpService<Options extends HttpServiceOptions> {
  get<R = unknown>(url: string, options?: Options): Promise<R>;
  post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Options
  ): Promise<R>;
  put<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R>;
  patch<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R>;
  delete<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R>;
}

export class HttpService<
  Options extends HttpServiceOptions,
> implements IHttpService<Options> {
  private client: HttpServiceClient<Options>;

  constructor(client: HttpServiceClient<Options>) {
    this.client = client;
  }

  public get<R = unknown>(url: string, options?: Options): Promise<R> {
    return this.client.get(url, this.configure(options));
  }

  public post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Options
  ): Promise<R> {
    return this.client.post(url, body, this.configure(options));
  }

  public put<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.client.put(url, body, this.configure(options));
  }

  public patch<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.client.patch(url, body, this.configure(options));
  }

  public delete<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.client.delete(url, body, this.configure(options));
  }

  private configure(customOptions?: Options): Options {
    return Object.assign(this.client.options, customOptions);
  }
}
