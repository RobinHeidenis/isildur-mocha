import { defaultOptions } from "test/helpers/getOptions/getOptions.test";
import { loadConfigFile } from "~/helpers/loadConfigFile";

describe("loadConfigFile", () => {
  it("should return a MochaOptions object", () => {
    const options = loadConfigFile("test/testResources/config.js");
    const expectedOptions = {
      ...defaultOptions,
      _: ["test/testResources/config.js"],
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error We need to do this to get a positive test result
    delete expectedOptions.default;
    expect(options).toEqual(expectedOptions);
  });
});
