import {
  BaseTestSuite,
  IsildurTestRunner,
  PartialTestRunnerOptions,
  TestSuite
} from "@isildur-testing/api";
import { methods } from "~/methods/index";

export class MochaRunner implements IsildurTestRunner {
  run(options?: PartialTestRunnerOptions): Promise<TestSuite[]> {
    return methods.runAllTests(options);
  }

  discover(options?: PartialTestRunnerOptions): Promise<BaseTestSuite[]> {
    return methods.discoverAllTests(options);
  }
}
