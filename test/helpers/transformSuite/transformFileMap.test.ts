import { BaseTestSuite } from "@isildur-testing/api";
import { Context, Suite, Test } from "mocha";
import { transformFileMap } from "~/helpers/transformSuite";

describe("transformFileMap", () => {
  it("should return an empty array if the fileMap is empty", () => {
    const result = transformFileMap(new Map());
    expect(result).toEqual([]);
  });

  it("should return an array of TestSuite objects", () => {
    const suite = new Suite("testSuite", new Context());
    suite.file = "test.ts";
    const test = new Test("test");
    test.file = "test.ts";
    suite.addTest(test);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        suites: [
          {
            name: "testSuite",
            file: "test.ts",
            suites: [],
            tests: [
              {
                name: "test",
                file: "test.ts",
                duration: -1,
              },
            ],
          },
        ],
        tests: [],
      } satisfies BaseTestSuite,
    ]);
  });

  it("should return an array of TestSuite objects with a top level test", () => {
    const test = new Test("test");
    test.file = "test.ts";
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [], tests: [test] });
    const result = transformFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        suites: [],
        tests: [
          {
            name: "test",
            file: "test.ts",
            duration: -1,
          },
        ],
      } satisfies BaseTestSuite,
    ]);
  });
});
