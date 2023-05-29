import { BaseTestSuite } from "@isildur-testing/api";
import { Context, Suite, Test } from "mocha";
import { transformDiscoveredSuite } from "~/helpers/transformSuite";

describe("transformDiscoveredSuite", () => {
  it("should return a BaseTestSuite object", () => {
    const suite = new Suite("testSuite", new Context());
    const result = transformDiscoveredSuite(suite);
    expect(result).toEqual({
      name: "testSuite",
      file: "",
      suites: [],
      tests: [],
    } satisfies BaseTestSuite);
  });

  it("should return a BaseTestSuite object with suites", () => {
    const suite = new Suite("testSuite", new Context());
    const childSuite = new Suite("childSuite", new Context());
    suite.addSuite(childSuite);
    const result = transformDiscoveredSuite(suite);
    expect(result).toEqual({
      name: "testSuite",
      file: "",
      suites: [
        {
          name: "childSuite",
          file: "",
          suites: [],
          tests: [],
        },
      ],
      tests: [],
    } satisfies BaseTestSuite);
  });

  it("should return a BaseTestSuite object with tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    suite.addTest(test);
    const result = transformDiscoveredSuite(suite);
    expect(result).toEqual({
      name: "testSuite",
      file: "",
      suites: [],
      tests: [
        {
          name: "test",
          file: "",
          duration: -1,
        },
      ],
    } satisfies BaseTestSuite);
  });

  it("should return a BaseTestSuite object with tests and suites", () => {
    const suite = new Suite("testSuite", new Context());
    const childSuite = new Suite("childSuite", new Context());
    const test = new Test("test");
    childSuite.addTest(test);
    suite.addSuite(childSuite);
    suite.addTest(test);
    const result = transformDiscoveredSuite(suite);
    expect(result).toEqual({
      name: "testSuite",
      file: "",
      suites: [
        {
          name: "childSuite",
          file: "",
          suites: [],
          tests: [
            {
              name: "test",
              file: "",
              duration: -1,
            },
          ],
        },
      ],
      tests: [
        {
          name: "test",
          file: "",
          duration: -1,
        },
      ],
    } satisfies BaseTestSuite);
  });
});
