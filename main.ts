import * as Agents from "./agents.ts";
import * as AgentSystem from "./agentSystem.ts";
import { Browser, Builder } from "./node_modules/selenium-webdriver/index.js";

//================================================

const task = `Execute the following acceptance criteria in a browser: Given I have an open browser at at https://duckduckgo.com, when I click on the input with the text 'Search without being tracked' enter 'deno language', then I click on the submit button then I should see text on the page that says 'Deno, the next-generation JavaScript runtime'`;

export async function main() {
  const debug = true;
  const driver = new Builder().forBrowser(Browser.FIREFOX).build();

  const output = await AgentSystem.runJob(
    AgentSystem.initializeAgent(Agents.coordinator, "coordinator"),
    [
      Agents.seleniumStepRunner,
      Agents.breakDownAcceptanceCriteriaIntoTestSteps,
    ],
    task,
    driver,
    debug
  );

  AgentSystem.log(output, debug);
}

main();
