import * as AgentSystem from "../../agentSystem.ts";
import { AgentDefinition, State, Tool } from "../../types/agentTypes.ts";
import {
  OpenAiApiTool,
  OpenAiApiToolCall,
} from "../../types/openAiApiTypes.ts";
import * as AgentFunctions from "./agentFunctions.ts";

const agentTaskCompleteDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "agent_task_complete",
    description:
      "This tool is used to indicate that the current task has either completed successfully or failed. The response parameter will contain details of if the task succeeded or failed, an then additional information. This tool should be used when there are not any more steps to carry out in the current task. It is very important that this tool is only used once, do not use multiple tools to communicate the result of a task.",
    parameters: {
      type: "object",
      properties: {
        response: {
          type: "string",
          description:
            "The output of your task. The response should begin with a statement of if the task succeeded or failed and then additional data about the result. This additional data might be a textual response or a data structure such as a JSON object.",
        },
      },
      required: ["response"],
    },
  },
};

const agentAssignTaskDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "agent_assign_task",
    description:
      "Instruct an agent to perform a task. All the information needed by the agent must be provided in the task description. The agent will respond with the result of the task.",
    parameters: {
      type: "object",
      properties: {
        agentName: {
          type: "string",
          description: "The name of the agent who should perform the task",
        },
        task: {
          type: "string",
          description:
            "A detailed description of the task to be performed by the agent",
        },
      },
      required: ["agent", "task"],
    },
  },
};

export const agentAssignTask: Tool = {
  definition: agentAssignTaskDefinition,
  executor: AgentFunctions.processAgentAssignTask,
};

export const agentTaskComplete: Tool = {
  definition: agentTaskCompleteDefinition,
  executor: AgentFunctions.processAgentTaskComplete,
};
