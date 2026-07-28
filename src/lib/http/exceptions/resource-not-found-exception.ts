import { type NormalizedOptions } from "ky";

import { AjaxError } from "../ajax-error";

export class ResourceNotFoundException extends AjaxError {
  constructor(
    response: Response,
    request: Request,
    options: NormalizedOptions,
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
