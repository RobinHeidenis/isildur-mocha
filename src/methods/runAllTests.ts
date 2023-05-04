import { TestSuite } from "@isildur-testing/api";
import { globSync } from "glob";
if (globSync("**/tsconfig.json", { ignore: ["node_modules/**"] }).length > 0) {
  require("ts-mocha");
}

// import mocha after ts-mocha
import Mocha from "mocha";

export const runAllTests = async (): Promise<TestSuite[]> => {
  return new Promise((resolve) => {
    const mocha = new Mocha();
    const testyFiles = globSync(
      "**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
      { ignore: ["node_modules/**"] }
    );
    const suites: TestSuite[] = [];
    testyFiles.forEach((file) => {
      mocha.addFile(file);
    });

    void mocha.loadFilesAsync().then(() => {
      mocha
        .run()
        .on("suite end", (suite) => {
          if (!suite.root) return;

          suite.suites.forEach((suite) => {
            suites.push({
              name: suite.title,
              file: suite.file ?? "",
              duration: suite.tests.reduce(
                (acc, test) => acc + (test.duration ?? 0),
                0
              ),
              numFailing: suite.tests.filter((test) => test.state === "failed")
                .length,
              numPassing: suite.tests.filter((test) => test.state === "passed")
                .length,
              numSkipped: suite.tests.filter((test) => test.pending).length,
              numTodo: 0,
              tests: suite.tests.map((test) => {
                const baseResult = {
                  name: test.title,
                  file: suite.file ?? "",
                  duration: test.duration ?? 0,
                };

                if (test.state === "failed") {
                  return {
                    ...baseResult,
                    status: "fail",
                    error: test.err?.message ?? "",
                  };
                }

                if (test.state === "passed") {
                  return {
                    ...baseResult,
                    status: "pass",
                  };
                }

                return {
                  ...baseResult,
                  status: "skipped",
                };
              }),
            });
          });
        })
        .on("end", () => {
          resolve(suites);
        });
    });
  });
};
