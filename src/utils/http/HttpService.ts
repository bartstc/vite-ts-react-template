import ky from "ky";

import { AjaxError } from "./AjaxError";
import { FetchOptions } from "./Options";
import {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";

type HttpMethod = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

interface IHttpServiceOptions extends FetchOptions {}

interface IHttpService<Options extends IHttpServiceOptions> {
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

export class HttpService<Options extends IHttpServiceOptions>
  implements IHttpService<Options>
{
  private http: ReturnType<(typeof ky)["create"]>;

  constructor(private readonly options: Options) {
    this.options = options;
    this.http = ky.create({
      prefixUrl: options.host,
      ...options,
      hooks: {
        beforeError: [
          (error) => {
            const { response, request, options } = error;

            if (request?.method === "GET" && response?.status === 404) {
              return new ResourceNotFoundException(response, request, options);
            }

            if (response?.body && response?.status) {
              return new AjaxError(
                response.status,
                response,
                request,
                options,
                `Ajax error occurred (${response.status})`
              );
            }

            return new InternalServerException(response, request, options);
          },
        ],
      },
    });
  }

  public get<R = unknown>(url: string, options?: Options): Promise<R> {
    return this.request({ method: "GET", url, options });
  }

  public post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Options
  ): Promise<R> {
    return this.request({ method: "POST", url, body, options });
  }

  public put<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.request({ method: "PUT", url, body, options });
  }

  public patch<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.request({ method: "PATCH", url, body, options });
  }

  public delete<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.request({ method: "DELETE", url, body, options });
  }

  private request<R = unknown, B = unknown>({
    method,
    body,
    url,
    options: customOptions,
  }: {
    method: HttpMethod;
    url: string;
    body?: B;
    options?: Options;
  }): Promise<R> {
    // lib provider must to tell how to parse options
    const options: Options = { ...this.options, json: body, ...customOptions };

    switch (method) {
      case "GET":
        return this.http.get(url, options).json();
      case "POST":
        return this.http.post(url, options).json();
      case "PUT":
        return this.http.put(url, options).json();
      case "PATCH":
        return this.http.patch(url, options).json();
      case "DELETE":
        return this.http.delete(url, options).json();
      default:
        throw new Error("Unknown http method");
    }
  }
}
