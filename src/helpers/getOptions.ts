import { PartialTestRunnerOptions } from "@isildur-testing/api";
import { loadConfigFile } from "~/helpers/loadConfigFile";

function has<K extends keyof PartialTestRunnerOptions>(
  obj: PartialTestRunnerOptions | undefined,
  prop: K
): obj is PartialTestRunnerOptions & Record<K, unknown> {
  return obj !== undefined && prop in obj;
}

export const getOptions = () => {
  const options = process.argv[2]
    ? (JSON.parse(process.argv[2]) as PartialTestRunnerOptions)
    : undefined;

  return {
    ...(options?.config && loadConfigFile(`--config=${options.config}`)),
    ...(has(options, "bail") && { bail: options.bail }),
    ...(has(options, "diff") && { diff: options.diff }),
    ...(has(options, "allowNoTests") && { failZero: !options.allowNoTests }),
    ...(has(options, "testNameFilter") && { grep: options.testNameFilter }),
    ...(has(options, "timeout") && { timeout: options.timeout }),
    ...(has(options, "maxWorkers") && { jobs: options.maxWorkers }),
    ...options?.runnerOptions,
  } satisfies Mocha.MochaOptions;
};
