import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it } from "vitest";

import { AjaxError } from "@/lib/http/ajax-error";
import { InternalServerException } from "@/lib/http/exceptions/internal-server-exception";
import { ResourceNotFoundException } from "@/lib/http/exceptions/resource-not-found-exception";
import { AUTH_TOKEN_KEY, KyClient } from "@/lib/http/ky-client";
import { mswServer } from "@/test-lib/msw-server";

// AIDEV-NOTE: Pins the beforeError -> exception mapping and beforeRequest auth injection.
// These are the contracts consumers branch on (parse-checkout-error reads `body`,
// ErrorPageStrategy reads `status`, Product page checks ResourceNotFoundException), and
// none of them are visible to tsc — a ky upgrade can break them while typecheck stays green.

const host = "http://localhost:3001/api";

const createClient = () => new KyClient({ baseUrl: `${host}/` });

afterEach(() => {
  localStorage.clear();
});

describe("KyClient error mapping", () => {
  it("maps a GET 404 to ResourceNotFoundException", async () => {
    mswServer.use(
      http.get(`${host}/products/1`, () =>
        HttpResponse.json({ message: "nope" }, { status: 404 })
      )
    );

    const error = await createClient()
      .get(`products/1`)
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ResourceNotFoundException);
    expect(error).toBeInstanceOf(AjaxError);
    expect((error as ResourceNotFoundException).status).toBe(404);
    expect((error as ResourceNotFoundException).name).toBe(
      "ResourceNotFoundException"
    );
  });

  it("maps a non-GET 404 to AjaxError, not ResourceNotFoundException", async () => {
    mswServer.use(
      http.delete(`${host}/carts/1`, () =>
        HttpResponse.json({ message: "gone" }, { status: 404 })
      )
    );

    const error = await createClient()
      .delete(`carts/1`)
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AjaxError);
    expect(error).not.toBeInstanceOf(ResourceNotFoundException);
    expect((error as AjaxError).status).toBe(404);
  });

  it("takes the error message from the JSON body", async () => {
    mswServer.use(
      http.get(`${host}/products`, () =>
        HttpResponse.json({ message: "Out of stock" }, { status: 400 })
      )
    );

    const error = await createClient()
      .get(`products`)
      .catch((e: unknown) => e);

    expect((error as AjaxError).message).toBe("Out of stock");
    expect((error as AjaxError).status).toBe(400);
  });

  // AIDEV-NOTE: `body` carries the full parsed payload so checkout can recover `code`/`items`.
  // ky 2 pre-consumes the response stream into `error.data`, so a naive `response.json()`
  // here silently yields undefined — this test is the tripwire for that.
  it("exposes the full parsed JSON body for structured error recovery", async () => {
    mswServer.use(
      http.post(`${host}/checkout/apply`, () =>
        HttpResponse.json(
          { code: "OutOfStock", items: [{ productId: "p1" }] },
          { status: 400 }
        )
      )
    );

    const error = await createClient()
      .post(`checkout/apply`, {})
      .catch((e: unknown) => e);

    expect((error as AjaxError).body).toEqual({
      code: "OutOfStock",
      items: [{ productId: "p1" }],
    });
  });

  it("falls back to a generic message when the body is not JSON", async () => {
    mswServer.use(
      http.get(`${host}/products`, () =>
        HttpResponse.text("<html>boom</html>", { status: 502 })
      )
    );

    const error = await createClient()
      .get(`products`)
      .catch((e: unknown) => e);

    expect((error as AjaxError).status).toBe(502);
    expect((error as AjaxError).message).toBe("Ajax error occurred (502)");
    expect((error as AjaxError).body).toBeUndefined();
  });

  it("maps an empty-body error response to InternalServerException", async () => {
    mswServer.use(
      http.get(
        `${host}/products`,
        () => new HttpResponse(null, { status: 500 })
      )
    );

    const error = await createClient()
      .get(`products`)
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(InternalServerException);
    expect((error as InternalServerException).status).toBe(500);
  });
});

describe("KyClient auth header", () => {
  it("attaches the bearer token when one is stored", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "token-123");

    let authorization: string | null = null;
    mswServer.use(
      http.get(`${host}/products`, ({ request }) => {
        authorization = request.headers.get("Authorization");
        return HttpResponse.json({ ok: true });
      })
    );

    await createClient().get(`products`);

    expect(authorization).toBe("Bearer token-123");
  });

  it("sends no Authorization header when no token is stored", async () => {
    let authorization: string | null = "unset";
    mswServer.use(
      http.get(`${host}/products`, ({ request }) => {
        authorization = request.headers.get("Authorization");
        return HttpResponse.json({ ok: true });
      })
    );

    await createClient().get(`products`);

    expect(authorization).toBeNull();
  });
});

describe("KyClient responses", () => {
  it("parses a JSON response body", async () => {
    mswServer.use(
      http.get(`${host}/products`, () => HttpResponse.json({ id: "p1" }))
    );

    await expect(createClient().get(`products`)).resolves.toEqual({ id: "p1" });
  });

  it("sends the request body as JSON", async () => {
    let received: unknown;
    mswServer.use(
      http.put(`${host}/carts/1`, async ({ request }) => {
        received = await request.json();
        return HttpResponse.json({ ok: true });
      })
    );

    await createClient().put(`carts/1`, { quantity: 2 });

    expect(received).toEqual({ quantity: 2 });
  });

  it("resolves to undefined for a 204 delete", async () => {
    mswServer.use(
      http.delete(
        `${host}/carts/1`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    await expect(createClient().delete(`carts/1`)).resolves.toBeUndefined();
  });
});
