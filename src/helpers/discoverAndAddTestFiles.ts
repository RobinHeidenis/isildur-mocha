import { glob } from "glob";

export const discoverAndAddTestFiles = async (mocha: Mocha) => {
  const testFiles = await glob(
    "**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    { ignore: ["node_modules/**"] }
  );

  testFiles.forEach((file) => {
    mocha.addFile(file);
  });
};
