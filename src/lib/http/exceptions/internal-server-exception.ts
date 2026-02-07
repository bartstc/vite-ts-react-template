import { HTTPError } from "ky";

import { AjaxError } from "../ajax-error";

export class InternalServerException extends AjaxError {
  constructor(
    response: Response,
    request: Request,
    options: HTTPError["options"]
  ) {
    super(500, response, request, options, `Unknown internal server error`);
    this.name = "InternalServerException";
  }
}
