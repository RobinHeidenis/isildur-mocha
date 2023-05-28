import { BaseTestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { Reporter } from "~/customReporter";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles";
import { getOptions } from "~/helpers/getOptions";
import { EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { parseRanSuite } from "~/helpers/parseSuite";

if (!process.send) throw new Error("This file must be run as a child process.");

let results: BaseTestSuite[];

const runAllTests = async () => {
  if (
    globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0
  ) {
    require("ts-mocha");
  }

  const mocha = new Mocha({
    ...getOptions(),
    reporter: Reporter,
  });

  await discoverAndAddTestFiles(mocha);

  await mocha.loadFilesAsync();

  return new Promise<BaseTestSuite[]>((resolve) => {
    mocha.run().on(EVENT_SUITE_END, (suite) => {
      if (!suite.root) return;

      results = parseRanSuite(suite);

      resolve(results);
    });
  });
};

runAllTests()
  .then((discoveredTests) => {
    if (!process.send) return;

    process.send(discoveredTests);
  })
  .finally(() => {
    process.exit();
  });
