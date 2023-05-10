import { BaseTestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
if (globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0) {
  require("ts-mocha");
}

// import mocha after ts-mocha
import Mocha from "mocha";
import { Reporter } from "~/customReporter";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { EVENT_RUN_END, EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { transformDiscoveredSuite } from "~/helpers/transformSuite";

export const discoverAllTests = async (): Promise<BaseTestSuite[]> => {
  const mocha = new Mocha({reporter: Reporter});
  await discoverAndAddTestFiles(mocha);
  const suites: BaseTestSuite[] = [];

  await mocha.loadFilesAsync();

  return new Promise((resolve) => {
    mocha
      .dryRun()
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        suite.suites.forEach((suite) =>
          suites.push(transformDiscoveredSuite(suite))
        );
      })
      .on(EVENT_RUN_END, () => resolve(suites));
  });
};
