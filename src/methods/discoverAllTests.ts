import { BaseTestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { Reporter } from "~/customReporter";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { EVENT_RUN_END, EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import {
  transformDiscoveredSuite,
  transformFileMap,
} from "~/helpers/transformSuite";

export const discoverAllTests = async (): Promise<BaseTestSuite[]> => {
  if (
    globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0
  ) {
    require("ts-mocha");
  }

  const mocha = new Mocha({ reporter: Reporter });
  await discoverAndAddTestFiles(mocha);
  let suites: BaseTestSuite[] = [];

  await mocha.loadFilesAsync();

  return new Promise((resolve) => {
    mocha
      .dryRun()
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        const fileMap = new Map<
          string,
          { suites: Mocha.Suite[]; tests: Mocha.Test[] }
        >();

        suite.suites.filter((suite) => suite.file).forEach((suite) => {
          if (fileMap.get(suite.file)) {
            fileMap.get(suite.file ?? "")?.suites.push(suite);
          } else {
            fileMap.set(suite.file ?? "", { suites: [suite], tests: [] });
          }
          suites.push(transformDiscoveredSuite(suite));
        });
        suite.tests.forEach((test) => {
          if (fileMap.get(test.file ?? "")) {
            fileMap.get(test.file ?? "")?.tests.push(test);
          } else {
            fileMap.set(test.file ?? "", { suites: [], tests: [test] });
          }
        });

        suites = transformFileMap(fileMap);
        console.log(fileMap);
        console.log(suites);
      })
      .on(EVENT_RUN_END, () => resolve(suites));
  });
};
