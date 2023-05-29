export const loadConfigFile = (configFilePath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const loadOptions: (
    argv?: string[] | string
  ) => Record<string, unknown> | undefined =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    require("mocha/lib/cli/options").loadOptions; // this function is not exported from the Mocha package, so we have to use require to get it. Inspiration taken from https://github.com/stryker-mutator/stryker-js/blob/master/packages/mocha-runner/src/lib-wrapper.ts#L24

  const options = loadOptions(configFilePath);

  return options;
};
