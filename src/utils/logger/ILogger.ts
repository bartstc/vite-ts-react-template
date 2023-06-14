// should be https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels/2031209#2031209?
export enum LogLevel {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
}

export enum LogEnvironment {
  Dev = "dev",
  Prod = "prod",
  Test = "test",
  Storybook = "storybook",
}

export type LogParams = {
  route?: string;
  stacktrace?: string;
  user?: object;
  tags?: string[];
  request?: string;
  response?: string;
  additionalInfo?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
};

export type Log = {
  name: string;
  level: LogLevel;
  message: string;
} & LogParams;

export interface ILogger {
  log(level: LogLevel, message: string, params?: LogParams): void;
  debug(message: string, params?: LogParams): void;
  info(message: string, params?: LogParams): void;
  warn(message: string, params?: LogParams): void;
  error(message: string, params?: LogParams): void;
}
