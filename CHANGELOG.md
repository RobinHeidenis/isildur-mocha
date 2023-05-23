# @isildur-testing/mocha

## 0.4.0

### Minor Changes

- a3c5cfa: Fixed parsing and transforming test results to the proper format. This was going wrong before, and will now produce the proper result regardless of which method you run

### Patch Changes

- 1d2e837: Fixed requiring of ts-mocha not running in some cases by placing the require inside the function itself (runAllTests, discoverAllTests)

## 0.3.2

### Patch Changes

- f817c42: Bump @isildur-testing/api to version 0.2.1

## 0.3.1

### Patch Changes

- d2a1c73: Rebuilt so it has types now

## 0.3.0

### Minor Changes

- e86ead2: Implemented discovering all tests in a project using Mocha

## 0.2.0

### Minor Changes

- 4c9ae59: Added support for running all tests with Mocha. This supports normal CommonJS syntax, as well as TypeScript and ESM syntax

### Patch Changes

- fb8c251: Bumped @isildur-testing/api to version 0.1.0
- e532f52: Removed totalTodo statistic from test results, to adhere to changes in the API schema
