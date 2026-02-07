import ky, { type Options } from "ky";

import { InternalServerException } from "@/lib/http/exceptions/internal-server-exception";
import { ResourceNotFoundException } from "@/lib/http/exceptions/resource-not-found-exception";

import { AjaxError } from "./ajax-error";
import { type HttpServiceClient } from "./http-service-client";

export interface KyClientOptions extends Options {}

export class KyClient implements HttpServiceClient<KyClientOptions> {
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
