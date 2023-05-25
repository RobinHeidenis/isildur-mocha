import { TestSuite } from "@isildur-testing/api";
import { fork } from "child_process";

export const runAllTests = async (): Promise<TestSuite[]> => {
  const childProcess = fork(
    __dirname + "/methods/childProcessMethods/runAllTests.cjs",
    [],
    { cwd: process.cwd() }
  );
  console.log("childProcess", childProcess);

  return new Promise((resolve) => {
    childProcess.on("message", (message) => {
      resolve(message as TestSuite[]);
    });
  });
};
