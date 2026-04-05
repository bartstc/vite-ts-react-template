export class UnknownError extends Error {
  constructor() {
    super("An unknown error occurred");
    this.name = "UnknownError";
  }
}
