import { Category, IProduct } from "modules/products/types";

import { createFixture } from "./createFixture";

export const ProductFixture = createFixture<IProduct>({
  id: 1,
  title: "White Nike Shoes",
  category: Category.Men_clothing,
  price: 129.99,
  image:
    "https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, blanditiis cum debitis doloremque eos excepturi explicabo fuga fugiat hic illo natus nobis non, odio sequi similique ullam velit vitae voluptatibus?",
  rating: {
    rate: 3.8,
    count: 329,
  },
});
