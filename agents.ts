import { AgentDefinition } from "./types/agentTypes.ts";
import * as Endpoints from "./endpoints.ts";
import * as AgentTools from "./tools/agent/agentTools.ts";
import * as BrowserTools from "./tools/browser/browserTools.ts";

export const coordinator: AgentDefinition = {
  name: "Coordinator",
  description:
    "An agent that coordinates the work of other agents to solve a problem",
  endpoint: Endpoints.openAiGpt4o,
  initialMessages: [
    {
      role: "system",
      content:
        "You are an AI agent coordinator that takes in a problem and solves it by using agents to break down the problem and then solve each part. Start by using an agent to break down the problem into steps, then starting with the first step, choose an agent to carry out the necessary action. Only tell an agent to perform a single task at a time. After the agent has finished their task, examine the response to see if it was successful, you must check the result do not assume the task succeeded. Only use a single tool at a time to tell an agent to perform a task. If the task was successful move on to the next step in your plan, you can choose any agent to carry out this step, it doesn't have to be the same agent again. Remember you can ask a planning agent to break down the rest of the problem for you at any time. If an agent fails to complete their task you should summarize the result and communicate that back to the user, there is nothing more to do in this case. When the problem is solved, provide a summary of the steps you took and the final result.",
    },
  ],
  tools: [AgentTools.agentTaskComplete, AgentTools.agentAssignTask],
};

export const breakDownAcceptanceCriteriaIntoTestSteps: AgentDefinition = {
  name: "BreakDownAcceptanceCriteriaIntoTestSteps",
  description:
    "An agent that takes an acceptance criteria for a feature and converts it into individual test steps needed to test the feature.",
  endpoint: Endpoints.openAiGpt4oMini,
  initialMessages: [
    {
      role: "system",
      content:
        "You are a testing agent that converts acceptance criteria for a product feature and turns it into a list of actionable steps needed to test the feature in a browser. This list will be provided to an agent with access to a browser toolset that can interact with a browser to perform actions like clicking on elements, typing text, and navigating to URLs in order to carry out these steps. Be sure to include all necessary steps to fully test the feature so that the runner agent can complete its task as in a single result. Only use one tool to communicate your results.",
    },
  ],

  tools: [AgentTools.agentTaskComplete],
};

export const seleniumStepRunner: AgentDefinition = {
  name: "SeleniumStepRunner",
  description:
    "An agent that executes a list of test steps in a browser using the Selenium toolset",
  endpoint: Endpoints.openAiGpt4o,
  initialMessages: [
    {
      role: "system",
      content:
        "You are a testing agent that receives an instruction and converts it into a specific set of instructions to carry out in a browser. You have access to a toolset that can interact with a browser to perform actions like clicking on elements, typing text, and navigating to URLs. You will receive a list of steps to follow in order to test a product feature. Your job is to execute the first step in a browser and then report if the task was completed to the original agent. Only use a single tool to communicate your results. If you use a tool and it fails, examine the result to determine why. Try again using the same tool with different inputs or check to see if there is a more appropriate tool to use. If there is nothing else to try, then report as much detail as you can about the failure and the things you attempted.",
    },
  ],

  tools: [
    AgentTools.agentTaskComplete,
    BrowserTools.browserNavigateToPage,
    BrowserTools.browserClickOnElement,
    BrowserTools.browserTypeText,
    BrowserTools.browserSelectElementByText,
    BrowserTools.browserSelectElementByPlaceholderText,
  ],
};
