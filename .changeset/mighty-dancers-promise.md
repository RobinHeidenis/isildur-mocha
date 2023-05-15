---
"@isildur-testing/mocha": patch
---

Fixed requiring of ts-mocha not running in some cases by placing the require inside the function itself (runAllTests, discoverAllTests)
