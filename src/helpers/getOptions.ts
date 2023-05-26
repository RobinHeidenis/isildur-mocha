import { loadConfigFile } from "~/helpers/loadConfigFile.js";

export const getOptions = () => {
  const options = process.argv[2]
    ? (JSON.parse(process.argv[2]) as Record<string, unknown>)
    : undefined;

  return options?.config
    ? loadConfigFile(
        options?.config
          ? `--config=${(options.config as string | undefined) ?? ""}`
          : ""
      )
    : undefined;
};
