export class InternalServerException extends Error {
  constructor(readonly resourceId?: string) {
    super();
    this.name = "InternalServerException";
    this.message = "Internal unknown server error";
  }
}
