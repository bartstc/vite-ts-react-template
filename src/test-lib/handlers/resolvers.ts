import { type http } from "msw";

export type GetResolver = Parameters<typeof http.get>[1];
export type DeleteResolver = Parameters<typeof http.delete>[1];
export type PutResolver = Parameters<typeof http.put>[1];
export type PostResolver = Parameters<typeof http.post>[1];
export type PatchResolver = Parameters<typeof http.patch>[1];
