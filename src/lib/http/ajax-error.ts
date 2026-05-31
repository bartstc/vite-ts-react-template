import { HTTPError } from "ky";

interface IAjaxError extends Error {
  message: string;
  status: number;
}

export class AjaxError<
  Response extends HTTPError["response"] = HTTPError["response"],
  Request extends HTTPError["request"] = HTTPError["request"],
>
  extends HTTPError
  implements IAjaxError
{
  message: string;
  status: number;
  name: string;
  // AIDEV-NOTE: full parsed error body (when JSON), so callers can recover structured
  // fields the message string drops — e.g. checkout's `code`/`items`/`changes`.
  body?: unknown;

  constructor(
    status: number,
    response: Response,
    request: Request,
    options: HTTPError["options"],
    message?: string,
    body?: unknown
  ) {
    super(response, request, options);
    this.status = status;
    this.message = message ?? "Ajax error message";
    this.name = "AjaxError";
    this.body = body;
  }
}
