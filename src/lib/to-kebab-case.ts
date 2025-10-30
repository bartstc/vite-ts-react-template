import { compose, join, split, replace, toLower } from "ramda";

export const toKebabCase = compose(
  join("-"),
  split(/(?<=[a-z])(?=[A-Z])|\W+|\s+/), // split on camelCase boundaries, non-alphanumeric characters and spaces
  replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1 $2"),
  toLower
);
