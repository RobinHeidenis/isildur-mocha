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

export const transformRanSuite = (suite: Mocha.Suite): TestSuite => {
  const base: TestSuite = {
    name: suite.title,
    file: suite.file ?? "",
    duration: 0,
    suites: suite.suites.map(transformRanSuite),
    tests: suite.tests.map((test) => {
      const baseResult = {
        name: test.title,
        file: suite.file ?? "",
        duration: test.duration ?? 0,
      };

      if (test.state === "failed") {
        return {
          ...baseResult,
          status: "failed",
          error: test.err?.message ?? "",
        };
      }

      if (test.state === "passed") {
        return {
          ...baseResult,
          status: "passed",
        };
      }

      return {
        ...baseResult,
        status: "skipped",
      };
    }),
  };

  return {
    ...base,
    duration:
      base.tests.reduce((acc, test) => acc + test.duration, 0) +
      base.suites.reduce((acc, suite) => acc + suite.duration, 0),
  };
};

export const transformDiscoveredSuiteFileMap = (
  fileMap: Map<string, { suites: Mocha.Suite[]; tests: Mocha.Test[] }>
) => {
  return Array.from(fileMap).map(([key, value]) => ({
    name: key,
    file: key,
    suites: value.suites.map((suite) => ({
      ...transformDiscoveredSuite(suite),
      file: key,
    })),
    tests: value.tests.map((test) => ({
      name: test.title,
      file: key,
      duration: test.duration ?? -1,
    })),
  }));
};

export const transformRanSuiteFileMap = (
  fileMap: Map<string, { suites: Mocha.Suite[]; tests: Mocha.Test[] }>
): TestSuite[] => {
  return Array.from(fileMap).map(([key, value]) => {
    const base: TestSuite = {
      name: key,
      file: key,
      duration: value.tests.reduce(
        (acc, test) => acc + (test.duration ?? 0),
        0
      ),
      suites: value.suites.map(transformRanSuite),
      tests: value.tests.map((test) => {
        const baseResult = {
          name: test.title,
          file: key,
          duration: test.duration ?? 0,
        };

        if (test.state === "failed") {
          return {
            ...baseResult,
            status: "failed",
            error: test.err?.message ?? "",
          };
        }

        if (test.state === "passed") {
          return {
            ...baseResult,
            status: "passed",
          };
        }

        return {
          ...baseResult,
          status: "skipped",
        };
      }),
    };

    return {
      ...base,
      duration:
        base.tests.reduce((acc, test) => acc + test.duration, 0) +
        base.suites.reduce((acc, suite) => acc + suite.duration, 0),
    };
  });
};
