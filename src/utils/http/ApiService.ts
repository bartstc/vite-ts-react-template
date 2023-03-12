import ky from "ky";

import { AjaxError } from "./AjaxError";
import { Options } from "./Options";
import {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";

export class ApiService {
  private api: ReturnType<typeof ky["create"]>;

  constructor(private readonly options: Options) {
    this.options = options;
    this.api = ky.create({
      prefixUrl: options.host,
      ...options,
      hooks: {
        beforeError: [
          (error) => {
            const { response, request, options } = error;

            if (request?.method === "GET") {
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
    return this.api.get(url, Object.assign(this.options, options)).json();
  }

  public delete<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.api.delete(url, { json: body, ...options }).json();
  }

  public post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Options
  ): Promise<R> {
    return this.api.post(url, { json: body, ...options }).json();
  }

  public put<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.api.put(url, { json: body, ...options }).json();
  }

  public patch<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.api.patch(url, { json: body, ...options }).json();
  }
}
