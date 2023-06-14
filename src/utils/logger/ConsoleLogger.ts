/* eslint-disable no-console */
import { ILogger, LogParams, LogLevel } from "./ILogger";

export class ConsoleLogger implements ILogger {
  static methodMap = {
    [LogLevel.Debug]: console.debug,
    [LogLevel.Info]: console.info,
    [LogLevel.Warning]: console.warn,
    [LogLevel.Error]: console.error,
  };

  log(level: LogLevel, message: string, params?: LogParams) {
    ConsoleLogger.methodMap[level](
      `${level.toUpperCase()}: ${message}`,
      params || ""
    );
  }

  debug(message: string, params?: LogParams) {
    console.debug(`DEBUG: ${message}`, params || "");
  }

  info(message: string, params?: LogParams) {
    console.info(`INFO: ${message}`, params || "");
  }

  warn(message: string, params?: LogParams) {
    console.warn(`WARN: ${message}`, params || "");
  }

  error(message: string, params?: LogParams) {
    console.error(`ERROR: ${message}`, params || "");
  }
}
