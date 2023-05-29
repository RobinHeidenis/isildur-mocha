import { BaseTestSuite, TestSuite } from "@isildur-testing/api";
import {
  transformDiscoveredSuiteFileMap,
  transformRanSuiteFileMap,
} from "~/helpers/transformSuite";

const createFileMap = (
  suite: Mocha.Suite
): Map<string, { suites: Mocha.Suite[]; tests: Mocha.Test[] }> => {
  const fileMap = new Map<
    string,
    { suites: Mocha.Suite[]; tests: Mocha.Test[] }
  >();

  suite.suites.forEach((suite) => {
    if (!suite.file) return;
    if (fileMap.get(suite.file)) {
      fileMap.get(suite.file ?? "")?.suites.push(suite);
    } else {
      fileMap.set(suite.file ?? "", { suites: [suite], tests: [] });
    }
  });
  suite.tests.forEach((test) => {
    if (fileMap.get(test.file ?? "")) {
      fileMap.get(test.file ?? "")?.tests.push(test);
    } else {
      fileMap.set(test.file ?? "", { suites: [], tests: [test] });
    }
  });

  return fileMap;
};

export const parseDiscoveredSuite = (suite: Mocha.Suite): BaseTestSuite[] => {
  return transformDiscoveredSuiteFileMap(createFileMap(suite));
};

export const parseRanSuite = (suite: Mocha.Suite): TestSuite[] => {
  return transformRanSuiteFileMap(createFileMap(suite));
};
