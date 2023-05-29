import { BaseTestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
import Mocha from "mocha";
import { Reporter } from "~/customReporter.js";
import { discoverAndAddTestFiles } from "~/helpers/discoverAndAddTestFiles.js";
import { getOptions } from "~/helpers/getOptions";
import { EVENT_SUITE_END } from "~/helpers/mochaEventConstants";
import { parseDiscoveredSuite } from "~/helpers/parseSuite";

if (!process.send) throw new Error("This file must be run as a child process.");

const discoverAllTests = async () => {
  if (
    globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0
  ) {
    require("ts-mocha"); // This is a hack to include ts-mocha by default if there's a tsconfig detected in the target project. In the future, we could suport a require option that gets execute before every test run, that the user can set themselves.
  }

  const mocha = new Mocha({
    ...getOptions(),
    reporter: Reporter, // Use custom silent reporter. In the future we could allow the user to specify their own reporter.
  });
  await discoverAndAddTestFiles(mocha);

  await mocha.loadFilesAsync(); // loadFilesAsync is used because it's the only loader that can support ESM modules.

  return new Promise<BaseTestSuite[]>((resolve) => {
    mocha
      .dryRun()
      .run()
      .on(EVENT_SUITE_END, (suite) => {
        if (!suite.root) return;

        resolve(parseDiscoveredSuite(suite));
      });
  });
};

discoverAllTests()
  .then((discoveredTests) => {
    if (!process.send) return; // Since we're in a loop, TS thinks process.send could have been overwritten, and thus we have to check again if it exists.

    process.send(discoveredTests);
  })
  .finally(() => {
    process.exit(); // Ensure graceful shutdown of the process, regardless of what happens.
  });
