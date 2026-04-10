export interface UserAddress {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation: { lat: string; long: string };
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  displayName: string;
  name: { firstname: string; lastname: string };
  phone: string;
  address: UserAddress;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  displayName: string;
}
