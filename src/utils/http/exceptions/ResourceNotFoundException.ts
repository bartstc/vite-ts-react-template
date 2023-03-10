export class ResourceNotFoundException extends Error {
  constructor(readonly resourceId?: string) {
    super();
    this.name = "ResourceNotFoundException";
    this.message = resourceId
      ? `Resource with ${resourceId} id not found`
      : "Resource not found";
  }
}
