export class UnauthorizedError extends Error {
  constructor() {
    super("User not authenticated");
    this.name = "UnauthorizedError";
  }
}
