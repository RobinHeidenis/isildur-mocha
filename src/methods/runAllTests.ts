import { PartialTestRunnerOptions, TestSuite } from "@isildur-testing/api";
import { fork } from "child_process";

export const runAllTests = async (
  options?: PartialTestRunnerOptions
): Promise<TestSuite[]> => {
  const childProcess = fork(
    __dirname + "/methods/childProcessMethods/runAllTests.cjs",
    [
      JSON.stringify({
        ...options,
      }),
    ],
    { cwd: process.cwd() }
  );

  return new Promise((resolve) => {
    childProcess.on("message", (message) => {
      resolve(message as TestSuite[]);
    });
  });
};
