import { BaseTestSuite, TestSuite } from "@isildur-testing/api";

export const transformDiscoveredSuite = (suite: Mocha.Suite): BaseTestSuite => {
  return {
    name: suite.title,
    file: suite.file ?? "",
    suites: suite.suites.map((suite) => {
      return transformDiscoveredSuite(suite);
    }),
    tests: suite.tests.map((test) => {
      return {
        name: test.title,
        file: suite.file ?? "",
        duration: test.duration ?? -1, // -1 to signal it did not run
      };
    }),
  };
};

export const transformSuite = (suite: Mocha.Suite): TestSuite => {
  return {
    name: suite.title,
    file: suite.file ?? "",
    duration: suite.tests.reduce((acc, test) => acc + (test.duration ?? 0), 0),
    numFailing: suite.tests.filter((test) => test.state === "failed").length,
    numPassing: suite.tests.filter((test) => test.state === "passed").length,
    numSkipped: suite.tests.filter((test) => test.pending).length,
    suites: suite.suites.map((suite) => transformSuite(suite)),
    tests: suite.tests.map((test) => {
      const baseResult = {
        name: test.title,
        file: suite.file ?? "",
        duration: test.duration ?? 0,
      };

      if (test.state === "failed") {
        return {
          ...baseResult,
          status: "fail",
          error: test.err?.message ?? "",
        };
      }

      if (test.state === "passed") {
        return {
          ...baseResult,
          status: "pass",
        };
      }

      return {
        ...baseResult,
        status: "skipped",
      };
    }),
  };
};
