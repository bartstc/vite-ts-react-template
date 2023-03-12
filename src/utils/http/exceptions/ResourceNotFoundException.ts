import { HTTPError } from "ky";

import { AjaxError } from "../AjaxError";

export class ResourceNotFoundException extends AjaxError {
  constructor(
    response: Response,
    request: Request,
    options: HTTPError["options"],
    resourceId?: string
  ) {
    super(
      404,
      response,
      request,
      options,
      resourceId
        ? `Resource with ${resourceId} id not found`
        : "Resource not found"
    );
    this.name = "ResourceNotFoundException";
  }
}
