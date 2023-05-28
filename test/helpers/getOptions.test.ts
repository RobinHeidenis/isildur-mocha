import { getOptions } from "~/helpers/getOptions";

export const defaultOptions = {
  _: [],
  config: false,
  default: {},
  diff: true,
  extension: ["js", "cjs", "mjs"],
  package: false,
  reporter: "spec",
  slow: 75,
  timeout: 2000,
  ui: "bdd",
  "watch-ignore": ["node_modules", ".git"],
};

describe("getOptions", () => {
  it("should return an options object with a timeout from the loaded config", () => {
    process.argv[2] = JSON.stringify({
      config: "test/testResources/config.js",
    });

    const options = getOptions();

    expect(options).toEqual({
      ...defaultOptions,
      default: {
        timeout: 10,
      },
    });
  });

  it("should return an options object with the bail option set", () => {
    process.argv[2] = JSON.stringify({
      bail: true,
    });

    const options = getOptions();

    expect(options).toEqual({
      bail: true,
    });
  });

  it("should return an options object with the diff option set", () => {
    process.argv[2] = JSON.stringify({
      diff: false,
    });

    const options = getOptions();

    expect(options).toEqual({
      diff: false,
    });

    process.argv[2] = JSON.stringify({
      diff: true,
    });

    const options2 = getOptions();

    expect(options2).toEqual({
      diff: true,
    });
  });

  it("should return an options object with the failZero option set", () => {
    process.argv[2] = JSON.stringify({
      allowNoTests: true,
    });

    const options = getOptions();

    expect(options).toEqual({
      failZero: false,
    });

    process.argv[2] = JSON.stringify({
      allowNoTests: false,
    });

    const options2 = getOptions();

    expect(options2).toEqual({
      failZero: true,
    });
  });

  it("should return an options object with the grep option set", () => {
    process.argv[2] = JSON.stringify({
      testNameFilter: "test",
    });

    const options = getOptions();

    expect(options).toEqual({
      grep: "test",
    });
  });

  it("should return an options object with the jobs option set", () => {
    process.argv[2] = JSON.stringify({
      maxWorkers: 2,
    });

    const options = getOptions();

    expect(options).toEqual({
      jobs: 2,
    });
  });

  it("should return an options object with the timeout option set", () => {
    process.argv[2] = JSON.stringify({
      timeout: 1000,
    });

    const options = getOptions();

    expect(options).toEqual({
      timeout: 1000,
    });
  });

  it("should return an options object with the runnerOptions option set", () => {
    process.argv[2] = JSON.stringify({
      runnerOptions: {
        timeout: 1000,
      },
    });

    const options = getOptions();

    expect(options).toEqual({
      timeout: 1000,
    });
  });

  it("should return an options object with no options set", () => {
    process.argv[2] = "";

    const options = getOptions();

    expect(options).toEqual({});
  });
});
