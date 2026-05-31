import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  initiateCheckoutHandler,
  applyCheckoutHandler,
  confirmCheckoutHandler,
} from "@/modules/checkout/checkout.handlers.js";
import {
  initiateCheckoutSchema,
  applyCheckoutSchema,
  confirmCheckoutSchema,
} from "@/modules/checkout/checkout.schemas.js";
import type {
  InitiateBody,
  ApplyBody,
  ConfirmBody,
} from "@/modules/checkout/checkout.types.js";

export async function checkoutRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: InitiateBody }>(
    "/api/checkout/initiate",
    { schema: { body: initiateCheckoutSchema }, preHandler: authenticate },
    initiateCheckoutHandler
  );
  app.post<{ Body: ApplyBody }>(
    "/api/checkout/apply",
    { schema: { body: applyCheckoutSchema }, preHandler: authenticate },
    applyCheckoutHandler
  );
  app.post<{ Body: ConfirmBody }>(
    "/api/checkout/confirm",
    { schema: { body: confirmCheckoutSchema }, preHandler: authenticate },
    confirmCheckoutHandler
  );
}
