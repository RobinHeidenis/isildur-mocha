import { BaseTestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { Reporter } from "~/customReporter.js";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles.js";
import { getOptions } from "~/helpers/getOptions.js";
import { EVENT_SUITE_END } from "~/helpers/mochaEventConstants.js";
import { parseDiscoveredSuite } from "~/helpers/parseSuite.js";

if (!process.send) throw new Error("This file must be run as a child process.");

let results: BaseTestSuite[];

const discoverAllTests = async () => {
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
    mocha
      .dryRun()
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        results = parseDiscoveredSuite(suite);

        resolve(results);
      });
  });
};

discoverAllTests()
  .then((discoveredTests) => {
    if (!process.send) return;

    process.send(discoveredTests);
  })
  .finally(() => {
    process.exit();
  });
