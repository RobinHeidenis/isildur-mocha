import { IsildurTestRunner, TestSuite } from "@isildur-testing/api";
import { methods } from "~/methods";

export class MochaRunner implements IsildurTestRunner {
  // eslint-disable-next-line @typescript-eslint/require-await
  async runAllTests(): Promise<TestSuite[]> {
    return methods.runAllTests();
  }
}
