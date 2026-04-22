import { HttpResponse } from "msw";

export const errorResponse = (status: number, message: string) =>
  HttpResponse.json({ message }, { status });
