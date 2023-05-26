import { BaseTestSuite, TestRunnerOptions } from "@isildur-testing/api";
import { fork } from "child_process";

export const discoverAllTests = async (
  options?: TestRunnerOptions
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
