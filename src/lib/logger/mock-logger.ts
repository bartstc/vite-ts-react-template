import { vi, expect } from "vitest";

import type { ILogger, LogParams } from "./logger-types";

export class MockLogger implements ILogger {
  log = vi.fn();
  name = "MockLogger";

  debug(message: string, params?: LogParams) {
    this.log("DEBUG", message, params);
  }
  info(message: string, params?: LogParams) {
    this.log("INFO", message, params);
  }
  warn(message: string, params?: LogParams) {
    this.log("WARN", message, params);
  }
  error(message: string, params?: LogParams) {
    this.log("ERROR", message, params);
  }

  get expectLogs() {
    return expect(this.log.mock.calls);
  }
}
