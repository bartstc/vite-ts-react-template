import type { Meta } from "@/types/meta";

import { createFixture } from "./create-fixture";

export const MetaFixture = createFixture<Meta>({
  limit: 10,
  total: 20,
  sort: "asc",
});
