import type { User } from "@/modules/auth/auth.types.js";

export const seedUsers: User[] = [
  {
    id: 1,
    email: "bob@test.com",
    username: "bob",
    password: "Pa$$w0rd",
    displayName: "Bob",
    name: { firstname: "Bob", lastname: "Smith" },
    phone: "1-234-567-8900",
    address: {
      city: "Anytown",
      street: "Main St",
      number: 123,
      zipcode: "12345",
      geolocation: { lat: "40.7128", long: "-74.0060" },
    },
  },
  {
    id: 2,
    email: "tom@test.com",
    username: "tom",
    password: "Pa$$w0rd",
    displayName: "Tom",
    name: { firstname: "Tom", lastname: "Jones" },
    phone: "1-345-678-9001",
    address: {
      city: "Someville",
      street: "Oak Ave",
      number: 456,
      zipcode: "23456",
      geolocation: { lat: "34.0522", long: "-118.2437" },
    },
  },
  {
    id: 3,
    email: "jane@test.com",
    username: "jane",
    password: "Pa$$w0rd",
    displayName: "Jane",
    name: { firstname: "Jane", lastname: "Doe" },
    phone: "1-456-789-0123",
    address: {
      city: "Othertown",
      street: "Elm St",
      number: 789,
      zipcode: "34567",
      geolocation: { lat: "41.8781", long: "-87.6298" },
    },
  },
];
