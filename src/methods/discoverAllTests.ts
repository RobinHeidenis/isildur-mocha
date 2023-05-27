import { BaseTestSuite, PartialTestRunnerOptions } from "@isildur-testing/api";
import { fork } from "child_process";

export const discoverAllTests = async (
  options?: PartialTestRunnerOptions
): Promise<BaseTestSuite[]> => {
  const childProcess = fork(
    __dirname + "/methods/childProcessMethods/discoverAllTests.cjs",
    [
      JSON.stringify({
        ...options,
      }),
    ],
    { cwd: process.cwd() }
  );

  return new Promise((resolve) => {
    childProcess.on("message", (message) => {
      resolve(message as BaseTestSuite[]);
    });
  });
};
