import { ThenableWebDriver } from "./node_modules/selenium-webdriver/index.js";
import { constructOpenAiApiRequestBody as constructOpenAiApiRequestBody } from "./openAiApi.ts";
import { Agent, AgentDefinition, State } from "./types/agentTypes.ts";
import {
  OpenAiApiResponse,
  OpenAiApiResponseMessage,
  OpenAiApiToolCall,
  OpenAiApiToolCallMessage,
  OpenAiApiToolResultMessage,
} from "./types/openAiApiTypes.ts";

export function addToolCallToAgentMessages(
  agent: Agent,
  toolCall: OpenAiApiToolCallMessage
): Agent {
  return { ...agent, messages: [...agent.messages, toolCall] };
}

export function addToolCallResultToAgentMessages(
  agent: Agent,
  toolId: string,
  result: string
): Agent {
  return {
    ...agent,
    messages: [
      ...agent.messages,
      {
        role: "tool",
        content: JSON.stringify(result),
        tool_call_id: toolId,
      },
    ],
  };
}

export function addUserMessageToAgentMessages(
  agent: Agent,
  message: string
): Agent {
  return {
    ...agent,
    messages: [
      ...agent.messages,
      {
        role: "user",
        content: message,
      },
    ],
  };
}

export function agentDescriptionToString(agent: AgentDefinition): string {
  return `{name: "${agent.name}", description: "${agent.description}"}`;
}

export function getNextResponse(
  state: State,
  agentDefinitions: AgentDefinition[],
  debug: boolean
): Promise<State> {
  return fetchNextResponse(getCurrentAgent(state), debug).then((response) => {
    const result = getMessageAndToolCallFromResponse(response);
    if (result instanceof Error) {
      return Promise.reject(result);
    } else {
      const { message, toolCall } = result;

      const updatedState = updateCurrentAgent(
        state,
        addToolCallToAgentMessages(getCurrentAgent(state), {
          role: "assistant",
          content: message.content,
          tool_calls: message.tool_calls,
        })
      );

      log(
        `[${getCurrentAgent(state).definition.name}] processing tool call: ${
          toolCall.function.name
        } with arguments: ${JSON.stringify(
          toolCall.function.arguments,
          null,
          2
        )}`,
        debug
      );

      const tool = getCurrentAgent(updatedState).definition.tools.find(
        (tool) => tool.definition.function.name === toolCall.function.name
      );
      if (tool === undefined) {
        return Promise.reject(
          new Error(
            `Tool with name ${toolCall.function.name} not found for agent ${
              getCurrentAgent(updatedState).definition.name
            }`
          )
        );
      } else {
        return tool.executor(updatedState, toolCall, debug);
      }
    }
  });
}

export function fetchNextResponse(
  agent: Agent,
  debug: boolean
): Promise<OpenAiApiResponse> {
  const request = constructOpenAiApiRequestBody(
    agent.definition.endpoint.model,
    agent.messages,
    agent.definition.tools.map((tool) => tool.definition)
  );

  const headers: [string, string][] = agent.definition.endpoint.headers.concat([
    ["content-type", "application/json"],
  ]);

  log("\n=====================================\n", debug);
  // log(`Sending request to ${agent.definition.endpoint.url}:`, debug);
  // if (headers.length > 0) {
  //   console.log(`With headers:\n${JSON.stringify(headers, null, 2)}`);
  // }
  // console.log(`With body:\n${JSON.stringify(request, null, 2)}`);

  return (
    fetch(agent.definition.endpoint.url, {
      method: "POST",
      body: JSON.stringify(request),
      headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.text().then((text) => {
            if (debug) {
              // log(`Got response:`, debug);
              // log(JSON.stringify(text, null, 2), debug);
              // log("=====================================\n", debug);
            }
            return JSON.parse(text);
          });
        } else {
          return response
            .text()
            .then((text) =>
              Promise.reject(
                new Error(
                  `Got ${response.status} from ${agent.definition.endpoint.url}:\n\n${text}`
                )
              )
            );
        }
      })
      // TODO: Another .then step that validates parsed JSON is an OpenAiApiResponse
      .catch((error) =>
        Promise.reject(
          new Error(
            `Error while communicating with ${agent.definition.endpoint.url}:\n\n${error}`
          )
        )
      )
  );
}

function getMessageAndToolCallFromResponse(
  response: OpenAiApiResponse
): { message: OpenAiApiResponseMessage; toolCall: OpenAiApiToolCall } | Error {
  const choice = response.choices.find(
    (choice) => choice.message.tool_calls.length > 0
  );
  if (choice === undefined) {
    return new Error("No tool calls found in response");
  } else if (choice.message.tool_calls.length > 1) {
    return new Error(
      `Expected at most one tool call in response, got ${choice.message.tool_calls.length}`
    );
  } else {
    return { message: choice.message, toolCall: choice.message.tool_calls[0] };
  }
}

export function runJob(
  coordinator: Agent,
  agentDefinitions: AgentDefinition[],
  problemStatement: string,
  browserDriver: ThenableWebDriver,
  debug: boolean = false
): Promise<string> {
  const initialState = addNewCurrentAgent(coordinator, {
    agentStack: [],
    agentDefinitions,
    browser: {
      driver: browserDriver,
      selectedElement: undefined,
    },
  });

  const additionalAgentsText = agentDefinitions
    .map(agentDescriptionToString)
    .join(", ");

  const taskPrompt = `Problem to be solved: ${problemStatement}.\nAgents that you can use to solve this problem: ${additionalAgentsText}`;

  const stateWithTaskPrompt = updateCurrentAgent(
    initialState,
    addUserMessageToAgentMessages(coordinator, taskPrompt)
  );

  return getNextResponse(stateWithTaskPrompt, agentDefinitions, debug)
    .then((finalState) => {
      if (debug) {
        // console.log(`Final state:\n${JSON.stringify(finalState, null, 2)}`);
      }

      return finalState.agentStack[0].messages[
        finalState.agentStack[0].messages.length - 1
      ].content;
    })
    .catch((error) => {
      return error;
    });
}

export function initializeAgent(
  definition: AgentDefinition,
  status: "coordinator" | { tool: string; toolCallId: string }
): Agent {
  return {
    definition,
    messages: definition.initialMessages,
    status,
  };
}

export function getCurrentAgent(state: State): Agent {
  return state.agentStack[state.agentStack.length - 1];
}

export function updateCurrentAgent(state: State, agent: Agent): State {
  return {
    ...state,
    agentStack: state.agentStack
      .slice(0, state.agentStack.length - 1)
      .concat(agent),
  };
}

export function addNewCurrentAgent(agent: Agent, state: State): State {
  return { ...state, agentStack: state.agentStack.concat(agent) };
}

export function removeCurrentAgent(state: State): State {
  return {
    ...state,
    agentStack: state.agentStack.slice(0, state.agentStack.length - 1),
  };
}

export function applyToolResultAndGoToNextStep(
  toolId: string,
  result: string,
  state: State,
  debug: boolean
): Promise<State> {
  const currentAgent = getCurrentAgent(state);
  const updatedAgent = addToolCallResultToAgentMessages(
    currentAgent,
    toolId,
    result
  );
  const updatedState = updateCurrentAgent(state, updatedAgent);
  return getNextResponse(updatedState, state.agentDefinitions, debug);
}

export function log(message: string, debug: boolean): void {
  if (debug) {
    console.log(message);
  }
}
