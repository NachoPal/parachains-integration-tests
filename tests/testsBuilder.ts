require('dotenv').config()
import getTestsConfig from "./getTestsConfig"
import { beforeConnectToProviders, beforeBuildEncodedCalls } from "./beforeTesting";
import { TestsConfig } from "./interfaces/test";
import { describersBuilder } from "./descriptor";

const main = async () => {
  let testsConfig: TestsConfig[] = getTestsConfig()
  let testConfig: TestsConfig

  beforeConnectToProviders()
  
  for (testConfig of testsConfig) {
    beforeBuildEncodedCalls(testConfig.settings.decodedCalls)

    for (const test of testConfig.tests) {
      describersBuilder(test)
    }
  }
}

main()