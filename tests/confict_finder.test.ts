import { conflictFinder } from "../lib/conflict_finder";
describe("Conflict Finder", () => {
  it("should return an error when we have both a route file and a route method file in the same directory", () => {
    try {
      conflictFinder([
        {
          absolute: "/home/username/project/src/routes/users/get.ts",
          pathAfterSrc: "/users/",
          fileName: "get.ts",
          type: "file",
          method: "get",
        },
        {
          absolute: "/home/username/project/src/routes/users/route.ts",
          pathAfterSrc: "/users/",
          fileName: "get.ts",
          type: "route",
        },
      ]);
    } catch (error) {
      expect(
        error.message.indexOf("Conflict found between these files")
      ).toBeGreaterThan(-1);
    }
  });

  it("should not return error when we have a route file and a route method file in different directories", () => {
    expect(
      conflictFinder([
        {
          absolute: "/home/username/project/src/routes/users/get.ts",
          pathAfterSrc: "/users/",
          fileName: "get.ts",
          type: "file",
          method: "get",
        },
        {
          absolute: "/home/username/project/src/routes/customers/route.ts",
          pathAfterSrc: "/customers/",
          fileName: "get.ts",
          type: "route",
        },
      ])
    ).toBeUndefined();
  });
});
