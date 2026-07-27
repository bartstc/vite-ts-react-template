import { HTTPError } from "ky";
import { describe, expect, it } from "vitest";

import { AjaxError } from "@/lib/http/ajax-error";
import { InternalServerException } from "@/lib/http/exceptions/internal-server-exception";
import { ResourceNotFoundException } from "@/lib/http/exceptions/resource-not-found-exception";

// AIDEV-NOTE: Consumers branch with `instanceof` (ErrorPageStrategy, parse-checkout-error,
// ErrorBoundary, the Product page). A ky upgrade that changes how HTTPError sets `name` or
// its prototype chain would break that narrowing silently — these tests pin it.

const createArgs = (status: number) => {
  const response = new Response(null, { status });
  const request = new Request("http://localhost:3001/api/products");
  return [response, request, {} as HTTPError["options"]] as const;
};

describe("AjaxError", () => {
  it("is both an Error and an HTTPError", () => {
    const [response, request, options] = createArgs(400);
    const error = new AjaxError(400, response, request, options);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HTTPError);
    expect(error).toBeInstanceOf(AjaxError);
  });

  it("keeps status, message, name and body", () => {
    const [response, request, options] = createArgs(400);
    const error = new AjaxError(
      400,
      response,
      request,
      options,
      "Bad request",
      { code: "PromoInvalid" }
    );

    expect(error.status).toBe(400);
    expect(error.message).toBe("Bad request");
    expect(error.name).toBe("AjaxError");
    expect(error.body).toEqual({ code: "PromoInvalid" });
  });

  it("falls back to a default message", () => {
    const [response, request, options] = createArgs(400);
    const error = new AjaxError(400, response, request, options);

    expect(error.message).toBe("Ajax error message");
    expect(error.body).toBeUndefined();
  });
});

describe("ResourceNotFoundException", () => {
  it("extends AjaxError with a 404 status", () => {
    const [response, request, options] = createArgs(404);
    const error = new ResourceNotFoundException(response, request, options);

    expect(error).toBeInstanceOf(AjaxError);
    expect(error.status).toBe(404);
    expect(error.name).toBe("ResourceNotFoundException");
    expect(error.message).toBe("Resource not found");
  });

  it("names the resource when an id is given", () => {
    const [response, request, options] = createArgs(404);
    const error = new ResourceNotFoundException(
      response,
      request,
      options,
      "abc"
    );

    expect(error.message).toBe("Resource with abc id not found");
  });
});

describe("InternalServerException", () => {
  it("extends AjaxError with a 500 status", () => {
    const [response, request, options] = createArgs(500);
    const error = new InternalServerException(response, request, options);

    expect(error).toBeInstanceOf(AjaxError);
    expect(error.status).toBe(500);
    expect(error.name).toBe("InternalServerException");
    expect(error.message).toBe("Unknown internal server error");
  });
});
