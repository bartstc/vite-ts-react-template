interface IAjaxError<R> extends Error {
  message: string;
  status: number;
  response: R;
  request: RequestInit;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AjaxError<R = any> implements IAjaxError<R> {
  message: string;
  status: number;
  response: R;
  name: string;
  request: RequestInit;

  constructor(
    errorStatus: number,
    response: R,
    request: IAjaxError<R>["request"]
  ) {
    this.status = errorStatus;
    // @ts-ignore
    this.message = response?.message ?? "Ajax Error Message";
    this.response = response;
    this.name = "Ajax Error";
    this.request = request;
  }
}
