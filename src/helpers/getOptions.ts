import { PartialTestRunnerOptions } from "@isildur-testing/api";
import { loadConfigFile } from "~/helpers/loadConfigFile.js";

export const getOptions = () => {
  const options = process.argv[2]
    ? (JSON.parse(process.argv[2]) as PartialTestRunnerOptions)
    : undefined;

  return {
    ...(options?.config &&
      loadConfigFile(
        options?.config
          ? `--config=${(options.config as string | undefined) ?? ""}`
          : ""
      )),
    ...(options?.bail && { bail: options.bail }),
    ...(options?.diff && { diff: options.diff }),
    ...(options?.allowNoTests && { failZero: !options.allowNoTests }),
    ...(options?.testNameFilter && { grep: options.testNameFilter }),
    ...(options?.timeout && { timeout: options.timeout }),
    ...(options?.maxWorkers && { jobs: options.maxWorkers }),
    ...options?.runnerOptions,
  } satisfies Mocha.MochaOptions;
};
