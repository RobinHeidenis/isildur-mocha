const { pathsToModuleNameMapper } = require("ts-jest");
const compilerOptions = require("./tsconfig.json");

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  roots: ["."],
  modulePaths: [
    compilerOptions.compilerOptions.baseUrl,
    "./src/**",
    "./src/helpers/**",
    "./src/helpers/transformSuite.ts",
  ],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.compilerOptions.paths
  ),
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "./src/index.ts",
    "./src/runner.ts",
    "./src/customReporter.ts",
    "./src/methods", //these three are untestable, since they require an actual project to run on
  ],
};

module.exports = jestConfig;
