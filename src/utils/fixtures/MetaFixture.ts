import { IMeta } from "types";

import { createFixture } from "./createFixture";

export const MetaFixture = createFixture<IMeta>({
  limit: 10,
  total: 20,
  sort: "asc",
});
