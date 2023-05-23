import { BaseTestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { Reporter } from "~/customReporter";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { parseDiscoveredSuite } from "~/helpers/parseSuite";

export const discoverAllTests = async (): Promise<BaseTestSuite[]> => {
  if (
    globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0
  ) {
    require("ts-mocha");
  }

  const mocha = new Mocha({ reporter: Reporter });
  await discoverAndAddTestFiles(mocha);

  await mocha.loadFilesAsync();

  return new Promise((resolve) => {
    mocha
      .dryRun()
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        resolve(parseDiscoveredSuite(suite));
      });
  });
};
