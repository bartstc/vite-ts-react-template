import { buildApp } from "@/app.js";
import { PORT } from "@/config.js";
import { seedDatabase } from "@/db/seed.js";

async function start(): Promise<void> {
  await seedDatabase();

  const app = buildApp();

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
