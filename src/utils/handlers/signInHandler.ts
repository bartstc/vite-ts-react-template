import { rest } from "msw";

import { host } from "utils/http";

import { PostResolver } from "./resolvers";

export const getSignInHandler = (resolver?: PostResolver) =>
  rest.post(`${host}/auth/login`, (req, res, ctx) => {
    if (resolver) return resolver(req, res, ctx);

    return res(ctx.json({ token: "authtoken" }));
  });
