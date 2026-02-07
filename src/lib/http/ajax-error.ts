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

  constructor(
    status: number,
    response: Response,
    request: Request,
    options: HTTPError["options"],
    message?: string
  ) {
    super(response, request, options);
    this.status = status;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.message = message ?? response?.body?.message ?? "Ajax error message";
    this.name = "AjaxError";
  }
}
