import { TestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
if (globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0) {
  require("ts-mocha");
}

// import mocha after ts-mocha
import Mocha from "mocha";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { EVENT_RUN_END, EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { transformSuite } from "~/helpers/transformSuite";

export const runAllTests = async (): Promise<TestSuite[]> => {
  const mocha = new Mocha();
  await discoverAndAddTestFiles(mocha);
  const suites: TestSuite[] = [];

  await mocha.loadFilesAsync();

  return new Promise((resolve) => {
    mocha
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        suite.suites.forEach((suite) => suites.push(transformSuite(suite)));
      })
      .on(EVENT_RUN_END, () => resolve(suites));
  });
};
