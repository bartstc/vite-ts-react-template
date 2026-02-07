import { describe, expect, it } from "vitest";

import { createFixture } from "./create-fixture";

type ContactType = "email" | "phone";

interface User {
  username: string;
  address: { country: string; city: string };
  contacts: { type: ContactType; value: string }[];
  skills: string[];
}

describe("createFixture", () => {
  const template: User = {
    username: "John Doe",
    address: { country: "Norway", city: "Oslo" },
    contacts: [
      { type: "phone", value: "123" },
      { type: "email", value: "johndoe@volue.com" },
    ],
    skills: ["React", "Typescript"],
  };

  it("should return an object with the correct methods", () => {
    const fixture = createFixture(template);

    expect(fixture).toHaveProperty("toStructure");
    expect(fixture).toHaveProperty("createPermutation");
    expect(fixture).toHaveProperty("createCollection");
  });

  describe("useDefault", () => {
    it("should return the correct data structure", () => {
      const fixture = createFixture(template);

      expect(fixture.toStructure()).toStrictEqual(template);
    });
  });

  describe("createPermutation", () => {
    it("should create a modified data structure", () => {
      const fixture = createFixture(template);

      const modifiedFixture = fixture.createPermutation({
        address: { city: "Bergen" },
        contacts: [
          { value: "456", type: "phone" },
          { value: "johnsmith@gmail.com", type: "email" },
        ],
        skills: ["Vue", "Typescript", "C#"],
      });

      expect(modifiedFixture).toStrictEqual({
        username: "John Doe",
        address: {
          country: "Norway",
          city: "Bergen",
        },
        contacts: [
          { type: "phone", value: "456" },
          { type: "email", value: "johnsmith@gmail.com" },
        ],
        skills: ["Vue", "Typescript", "C#"],
      });
    });
  });

  describe("createCollection", () => {
    it("should create an array of modified data structures", () => {
      const fixture = createFixture(template);

      const extendedCollection = fixture.createCollection([
        {
          username: "John Smith",
        },
        {
          address: { city: "Bergen" },
        },
        {
          contacts: [
            { value: "456", type: "phone" },
            { value: "johnsmith@volue.com" },
          ],
        },
        {},
      ]);

      expect(extendedCollection.map((item) => item)).toStrictEqual([
        {
          ...template,
          username: "John Smith",
        },
        {
          ...template,
          address: {
            country: "Norway",
            city: "Bergen",
          },
        },
        {
          ...template,
          contacts: [
            { type: "phone", value: "456" },
            { value: "johnsmith@volue.com" },
          ],
        },
        template,
      ]);
    });
  });
});
