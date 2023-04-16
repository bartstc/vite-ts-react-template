/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "modules/auth/application";

export const withAuth = (story: any) => {
  useAuthStore.setState({
    isAuthenticated: true,
    isError: false,
    state: "finished",
    user: {
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
    },
  });

  return story();
};
