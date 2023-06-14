import { action } from "@storybook/addon-actions";

import { ILogger, LogParams, LogLevel } from "./ILogger";

export class StorybookLogger implements ILogger {
  send = action("logger");

  log(level: LogLevel, message: string, params?: LogParams) {
    this.send(level, message, JSON.stringify(params));
  }
  debug(message: string, params?: LogParams) {
    this.send("DEBUG", message, JSON.stringify(params));
  }
  info(message: string, params?: LogParams) {
    this.send("INFO", message, JSON.stringify(params));
  }
  warn(message: string, params?: LogParams) {
    this.send("WARN", message, JSON.stringify(params));
  }
  error(message: string, params?: LogParams) {
    this.send("ERROR", message, JSON.stringify(params));
  }
}
