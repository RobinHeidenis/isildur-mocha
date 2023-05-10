import { MochaOptions, Runner, reporters } from "mocha";

// This reporter doens't output anything, since we're just returning the results back to the user's code.

export class Reporter extends reporters.Base {
  constructor(runner: Runner, public options: MochaOptions) {
    super(runner, options);
    return this;
  }
}
