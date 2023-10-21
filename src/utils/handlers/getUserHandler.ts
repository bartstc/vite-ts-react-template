import { rest } from "msw";

import { UserFixture } from "utils/fixtures";
import { host } from "utils/http";

import { GetResolver } from "./resolvers";

export const getUserHandler = (resolver?: GetResolver) =>
  rest.get(`${host}/users/:userId`, (req, res, ctx) => {
    if (resolver) return resolver(req, res, ctx);

    return res(ctx.json(UserFixture.toStructure()));
  });
