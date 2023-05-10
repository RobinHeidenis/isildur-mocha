import { BaseTestSuite, IsildurTestRunner, TestSuite } from "@isildur-testing/api";
import { methods } from "~/methods";

export class MochaRunner implements IsildurTestRunner {
  async runAllTests(): Promise<TestSuite[]> {
    return methods.runAllTests();
  }

  async discoverAllTests(): Promise<BaseTestSuite[]> {
    return methods.discoverAllTests();
  }
}
