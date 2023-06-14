import { ConsoleLogger } from "./ConsoleLogger";
import { ILogger, LogEnvironment } from "./ILogger";
import { StorybookLogger } from "./StorybookLogger";

// todo: HttpLogger
// todo: MockLogger
const HttpLogger = ConsoleLogger;

const loggers = {
  [LogEnvironment.Dev]:
    import.meta.env.VITE_HTTP_LOGGER_DEBUG_MODE === "true"
      ? HttpLogger
      : ConsoleLogger,
  [LogEnvironment.Prod]: HttpLogger,
  [LogEnvironment.Test]: ConsoleLogger,
  [LogEnvironment.Storybook]: StorybookLogger,
};

export class Logger {
  private static _client: ILogger | undefined;

  static log(...args: Parameters<ILogger["log"]>) {
    this.getClient().log(...args);
  }

  static debug(...args: Parameters<ILogger["debug"]>) {
    this.getClient().debug(...args);
  }

  static info(...args: Parameters<ILogger["info"]>) {
    this.getClient().info(...args);
  }

  static warn(...args: Parameters<ILogger["warn"]>) {
    this.getClient().warn(...args);
  }

  static error(...args: Parameters<ILogger["error"]>) {
    this.getClient().error(...args);
  }

  private static getClient(): ILogger {
    if (!this._client) {
      this.init();
    }

    return this._client!;
  }

  static init() {
    if (this._client === undefined) {
      if (import.meta.env.TEST) {
        console.info("Mock logger was initiated");
        return (this._client = new loggers[LogEnvironment.Test]());
      }

      if (import.meta.env.STORYBOOK === "true") {
        console.info("Storybook logger was initiated");
        return (this._client = new loggers[LogEnvironment.Storybook]());
      }

      if (import.meta.env.DEV) {
        console.info("Development logger was initiated");
        return (this._client = new loggers[LogEnvironment.Dev]());
      }

      this._client = new loggers[LogEnvironment.Prod]();
    }
  }
}
