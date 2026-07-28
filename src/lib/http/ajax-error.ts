import { KyError, type NormalizedOptions } from "ky";

interface IAjaxError extends Error {
  message: string;
  status: number;
}

// AIDEV-NOTE: Extends KyError, not HTTPError. ky 2 types HTTPError["name"] as the literal
// "HTTPError", which makes it unsubclassable when the subclass needs its own name — ky's own
// NetworkError/TimeoutError extend KyError for the same reason. Nothing in the app relies on
// `instanceof HTTPError`; consumers branch on AjaxError plus status/body/message/name.
export class AjaxError<
  Response extends globalThis.Response = globalThis.Response,
  Request extends globalThis.Request = globalThis.Request,
>
  extends KyError
  implements IAjaxError
{
  message: string;
  status: number;
  name: string;
  response: Response;
  request: Request;
  options: NormalizedOptions;
  // AIDEV-NOTE: full parsed error body (when JSON), so callers can recover structured
  // fields the message string drops — e.g. checkout's `code`/`items`/`changes`.
  body?: unknown;

  constructor(
    status: number,
    response: Response,
    request: Request,
    options: NormalizedOptions,
    message?: string,
    body?: unknown
  ) {
    super(message ?? "Ajax error message");
    this.response = response;
    this.request = request;
    this.options = options;
    this.status = status;
    this.message = message ?? "Ajax error message";
    this.name = "AjaxError";
    this.body = body;
  }
}
