import { IUser } from "modules/auth/types";

import { createFixture } from "./createFixture";

export const UserFixture = createFixture<IUser>({
  id: 1,
  cartId: 2,
  email: "John@gmail.com",
  username: "johnd",
  name: {
    firstname: "John",
    lastname: "Doe",
  },
  address: {
    city: "kilcoole",
    street: "7835 new road",
    number: 3,
    zipcode: "12926-3874",
    geolocation: {
      lat: "-37.3159",
      long: "81.1496",
    },
  },
  phone: "1-570-236-7033",
});
