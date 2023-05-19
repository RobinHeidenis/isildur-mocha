import { TestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { Reporter } from "~/customReporter";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { EVENT_RUN_END, EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { parseRanSuite } from "~/helpers/parseSuite";

export const runAllTests = async (): Promise<TestSuite[]> => {
  if (
    globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0
  ) {
    require("ts-mocha");
  }

  const mocha = new Mocha({reporter: Reporter});
  await discoverAndAddTestFiles(mocha);
  let suites: TestSuite[] = [];

  await mocha.loadFilesAsync();

  return new Promise((resolve) => {
    mocha
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        suites = parseRanSuite(suite);
      })
      .on(EVENT_RUN_END, () => resolve(suites));
  });
};
