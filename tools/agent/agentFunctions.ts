import { AgentDefinition, State } from "../../types/agentTypes.ts";
import { OpenAiApiToolCall } from "../../types/openAiApiTypes.ts";
import * as AgentSystem from "../../agentSystem.ts";

export function processAgentAssignTask(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  const toolCallArguments = JSON.parse(toolCall.function.arguments);

  const agentName = toolCallArguments["agentName"];
  const task = toolCallArguments["task"];
  const toolCallId = toolCall.id;

  const agentDefinition = state.agentDefinitions.find(
    (agent) => agent.name === agentName
  );
  if (agentDefinition === undefined) {
    return Promise.reject(
      new Error(`Cannot assign task, agent with name ${agentName} not found`)
    );
  }

  const agent = AgentSystem.initializeAgent(agentDefinition, {
    tool: "agent_assign_task",
    toolCallId,
  });

  const agentWithTaskMessage = AgentSystem.addUserMessageToAgentMessages(
    agent,
    task
  );

  const updatedState = AgentSystem.addNewCurrentAgent(
    agentWithTaskMessage,
    state
  );

  AgentSystem.log(`Assigned task to ${toolCallArguments["agentName"]}`, debug);

  return AgentSystem.getNextResponse(
    updatedState,
    state.agentDefinitions,
    debug
  );
}

export function processAgentTaskComplete(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  const toolCallArguments = JSON.parse(toolCall.function.arguments);
  const response = toolCallArguments["response"];
  const agentThatCompletedTask = AgentSystem.getCurrentAgent(state);

  if (agentThatCompletedTask.status === "coordinator") {
    AgentSystem.log(`Job finished`, debug);

    return Promise.resolve(state);
  } else {
    const stateAfterTaskCompletion = AgentSystem.removeCurrentAgent(state);
    const updatedAgent = AgentSystem.addToolCallResultToAgentMessages(
      AgentSystem.getCurrentAgent(stateAfterTaskCompletion),
      agentThatCompletedTask.status.toolCallId,
      response
    );
    const stateAfterToolCallResult = AgentSystem.updateCurrentAgent(
      stateAfterTaskCompletion,
      updatedAgent
    );

    AgentSystem.log(`Task completed: ${toolCallArguments["response"]}`, debug);

    return AgentSystem.getNextResponse(
      stateAfterToolCallResult,
      state.agentDefinitions,
      debug
    );
  }
}
