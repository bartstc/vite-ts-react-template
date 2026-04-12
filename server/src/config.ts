import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = 3001;
export const JWT_SECRET = "local-dev-secret-do-not-use-in-production";
export const DB_PATH = path.resolve(__dirname, "db/db.json");

// AIDEV-NOTE: set to false to disable auth on all mutation routes (dev convenience)
export const AUTH_ENABLED = true;
