import { TestSuite } from "@isildur-testing/api";
import { Context, Suite, Test } from "mocha";
import { transformRanSuite } from "~/helpers/transformSuite";

describe("transformRanSuite", () => {
  it("should return a TestSuite object", () => {
    const suite = new Suite("testSuite", new Context());
    const result = transformRanSuite(suite);
    expect(result).toEqual({
      name: "testSuite",
      file: "",
      duration: 0,
      suites: [],
      tests: [],
    } satisfies TestSuite);
  });

  it("should return a BaseTestSuite object with suites", () => {
    const suite = new Suite("testSuite", new Context());
    const childSuite = new Suite("childSuite", new Context());
    suite.addSuite(childSuite);
    const result = transformRanSuite(suite);
    expect(result).toEqual({
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
    } satisfies TestSuite);
  });

  it("should return a TestSuite object with tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    suite.addTest(test);
    const result = transformRanSuite(suite);
    expect(result).toEqual({
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
    } satisfies TestSuite);
  });

  it("should return a TestSuite object with tests and suites", () => {
    const suite = new Suite("testSuite", new Context());
    const childSuite = new Suite("childSuite", new Context());
    const test = new Test("test");
    childSuite.addTest(test);
    suite.addSuite(childSuite);
    suite.addTest(test);
    const result = transformRanSuite(suite);
    expect(result).toEqual({
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
    } satisfies TestSuite);
  });

  it("should return a TestSuite object with failed tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.state = "failed";
    suite.addTest(test);
    const result = transformRanSuite(suite);
    expect(result).toEqual({
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
    } satisfies TestSuite);
  });

  it("should return a TestSuite object with passed tests", () => {
    const suite = new Suite("testSuite", new Context());
    const test = new Test("test");
    test.state = "passed";
    suite.addTest(test);
    const result = transformRanSuite(suite);
    expect(result).toEqual({
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
    } satisfies TestSuite);
  });
});
