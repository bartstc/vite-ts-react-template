import { rest } from "msw";

export type GetResolver = Parameters<typeof rest.get>[1];
export type DeleteResolver = Parameters<typeof rest.delete>[1];
export type PutResolver = Parameters<typeof rest.put>[1];
export type PostResolver = Parameters<typeof rest.post>[1];
