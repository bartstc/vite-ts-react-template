import { IHttpService } from "./IHttpService";
import { IHttpServiceClient } from "./IHttpServiceClient";
import { IHttpServiceOptions } from "./IHttpServiceOptions";

export class HttpService<Options extends IHttpServiceOptions>
  implements IHttpService<Options>
{
  private client: IHttpServiceClient<Options>;

  constructor(client: IHttpServiceClient<Options>) {
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
