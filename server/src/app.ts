import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { registerCors } from "@/plugins/cors.js";
import { registerJwt } from "@/plugins/auth.js";
import { authRoutes } from "@/modules/auth/auth.routes.js";
import { productRoutes } from "@/modules/products/products.routes.js";
import { marketingRoutes } from "@/modules/marketing/marketing.routes.js";
import { cartRoutes } from "@/modules/carts/carts.routes.js";
import { checkoutRoutes } from "@/modules/checkout/checkout.routes.js";
import { testRoutes } from "@/modules/test/test.routes.js";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(fastifySwagger, {
    openapi: {
      info: { title: "Local API Server", version: "1.0.0" },
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: { persistAuthorization: true },
  });

  registerCors(app);
  registerJwt(app);

  app.register(authRoutes);
  app.register(productRoutes);
  app.register(marketingRoutes);
  app.register(cartRoutes);
  app.register(checkoutRoutes);
  app.register(testRoutes);

  return app;
}
