export const loadConfigFile = (configFilePath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const loadOptions: (
    argv?: string[] | string
  ) => Record<string, unknown> | undefined =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    require("mocha/lib/cli/options.js").loadOptions;

  const options = loadOptions(configFilePath);

  return options;
};
