import { TestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { parseRanSuite } from "~/helpers/parseSuite";

export const runAllTests = async (): Promise<TestSuite[]> => {
  if (
    globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0
  ) {
    require("ts-mocha");
  }

  const mocha = new Mocha();
  await discoverAndAddTestFiles(mocha);

  await mocha.loadFilesAsync();

  return new Promise((resolve) => {
    mocha
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        resolve(parseRanSuite(suite));
      });
  });
};
