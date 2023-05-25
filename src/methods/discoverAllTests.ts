import { BaseTestSuite } from "@isildur-testing/api";
import { fork } from "child_process";

export const discoverAllTests = async (): Promise<BaseTestSuite[]> => {
  const childProcess = fork(
    __dirname + "/methods/childProcessMethods/discoverAllTests.cjs",
    [],
    { cwd: process.cwd() }
  );

  return new Promise((resolve) => {
    childProcess.on("message", (message) => {
      resolve(message as BaseTestSuite[]);
    });
  });
};
