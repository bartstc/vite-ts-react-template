import ky, { Options } from "ky";

import { AjaxError } from "./AjaxError";
import { IHttpServiceClient } from "./IHttpServiceClient";
import {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";

export interface IKyClientOptions extends Options {}

export class KyClient implements IHttpServiceClient<IKyClientOptions> {
  public options: Options;
  private kyInstance: ReturnType<(typeof ky)["create"]>;

  constructor(options: Options) {
    this.options = options;
    this.kyInstance = ky.create({
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
    return this.kyInstance.get(url, options).json();
  }

  public post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options?: Options
  ): Promise<R> {
    return this.kyInstance.post(url, { json: body, ...options }).json();
  }

  public put<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.kyInstance.put(url, { json: body, ...options }).json();
  }

  public patch<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.kyInstance.patch(url, { json: body, ...options }).json();
  }

  public delete<R = unknown, B = unknown>(
    url: string,
    body?: B,
    options?: Options
  ): Promise<R> {
    return this.kyInstance.delete(url, { json: body, ...options }).json();
  }
}
