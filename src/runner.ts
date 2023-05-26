import {
  BaseTestSuite,
  IsildurTestRunner,
  TestRunnerOptions,
  TestSuite,
} from "@isildur-testing/api";
import { methods } from "~/methods/index.js";

export class MochaRunner implements IsildurTestRunner {
  run(options?: TestRunnerOptions): Promise<TestSuite[]> {
    return methods.runAllTests(options);
  }

  discover(options?: TestRunnerOptions): Promise<BaseTestSuite[]> {
    return methods.discoverAllTests(options);
  }
}
