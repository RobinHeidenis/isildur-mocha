import { TestSuite } from "@isildur-testing/api";
import { Context, Suite, Test } from "mocha";
import { transformRanSuiteFileMap } from "~/helpers/transformSuite";

describe("transformRanSuiteFileMap", () => {
  it("should return a TestSuiteFileMap object", () => {
    const suite = new Suite("testSuite", new Context());
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 0,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 0,
            suites: [],
            tests: [],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with suites", () => {
    const suite = new Suite("testSuite", new Context());
    const childSuite = new Suite("childSuite", new Context());
    suite.addSuite(childSuite);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 0,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 0,
            suites: [
              {
                name: "childSuite",
                file: "",
                duration: 0,
                suites: [],
                tests: [],
              },
            ],
            tests: [],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    suite.addTest(test);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 0,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 0,
            suites: [],
            tests: [
              {
                name: "test",
                file: "",
                duration: 0,
                status: "skipped",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with tests and suites", () => {
    const suite = new Suite("testSuite", new Context());
    const childSuite = new Suite("childSuite", new Context());
    const test = new Test("test");
    childSuite.addTest(test);
    suite.addSuite(childSuite);
    suite.addTest(test);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 0,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 0,
            suites: [
              {
                name: "childSuite",
                file: "",
                duration: 0,
                suites: [],
                tests: [
                  {
                    name: "test",
                    file: "",
                    duration: 0,
                    status: "skipped",
                  },
                ],
              },
            ],
            tests: [
              {
                name: "test",
                file: "",
                duration: 0,
                status: "skipped",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with tests with durations", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.duration = 100;
    suite.addTest(test);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 100,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 100,
            suites: [],
            tests: [
              {
                name: "test",
                file: "",
                duration: 100,
                status: "skipped",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with tests, one with a duration and one without", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.duration = 100;
    const test2 = new Test("test2");
    suite.addTest(test);
    suite.addTest(test2);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 100,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 100,
            suites: [],
            tests: [
              {
                name: "test",
                file: "",
                duration: 100,
                status: "skipped",
              },
              {
                name: "test2",
                file: "",
                duration: 0,
                status: "skipped",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with suites with failing tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.state = "failed";
    suite.addTest(test);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 0,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 0,
            suites: [],
            tests: [
              {
                name: "test",
                file: "",
                duration: 0,
                status: "failed",
                error: "",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with suites with passing tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.state = "passed";
    suite.addTest(test);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 0,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 0,
            suites: [],
            tests: [
              {
                name: "test",
                file: "",
                duration: 0,
                status: "passed",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });

  it("should return a TestSuiteFileMap object with top level tests with durations and mixed states", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.duration = 100;
    test.state = "passed";
    const test2 = new Test("test2");
    test2.duration = 200;
    test2.state = "failed";
    suite.addTest(test);
    suite.addTest(test2);
    const fileMap: Map<string, { suites: Suite[]; tests: Test[] }> = new Map();
    fileMap.set("test.ts", { suites: [suite], tests: [] });
    const result = transformRanSuiteFileMap(fileMap);
    expect(result).toEqual([
      {
        name: "test.ts",
        file: "test.ts",
        duration: 300,
        suites: [
          {
            name: "testSuite",
            file: "",
            duration: 300,
            suites: [],
            tests: [
              {
                name: "test",
                file: "",
                duration: 100,
                status: "passed",
              },
              {
                name: "test2",
                file: "",
                duration: 200,
                status: "failed",
                error: "",
              },
            ],
          },
        ],
        tests: [],
      },
    ] satisfies TestSuite[]);
  });
});
