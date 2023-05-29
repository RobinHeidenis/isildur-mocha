import { PartialTestRunnerOptions, TestSuite } from "@isildur-testing/api";
import { fork } from "child_process";

export const runAllTests = async (
  options?: PartialTestRunnerOptions
): Promise<TestSuite[]> => {
  const childProcess = fork(
    __dirname + "/methods/childProcessMethods/runAllTests.cjs", // We're working out of the compiled dist folder, and thus need to use the compiled JS file. The VSCode extension can't use ESM files, so the CJS version is used to ensure compatibility.
    [
      JSON.stringify({
        ...options, // Options are passed to the child process as a JSON string. Node process arguments have to be strings.
      }),
    ],
    { cwd: process.cwd() }
  );

  return new Promise((resolve) => {
    childProcess.on("message", (message) => {
      resolve(message as TestSuite[]); // In the future we could check the message type to ensure it's a TestSuite[].
    });
  });
};
