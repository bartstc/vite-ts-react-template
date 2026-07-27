import { type NormalizedOptions } from "ky";

import { AjaxError } from "../ajax-error";

export class InternalServerException extends AjaxError {
  constructor(
    response: Response,
    request: Request,
    options: NormalizedOptions
  ) {
    super(500, response, request, options, `Unknown internal server error`);
    this.name = "InternalServerException";
  }
}
