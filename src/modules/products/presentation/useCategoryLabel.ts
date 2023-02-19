import { t } from "utils";

import { Category } from "../types";

export const useCategoryLabel = (category: Category) => {
  const message = messages[category];

  return (t(message) as string) ?? category;
};

const messages = {
  [Category.Women_clothing]: "Women's clothing",
  [Category.Men_clothing]: "Men's clothing",
  [Category.Jewelery]: "Jewelery",
  [Category.Electronics]: "Electronics",
};
