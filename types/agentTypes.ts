import {
  ThenableWebDriver,
  WebElement,
} from "../node_modules/selenium-webdriver/index.js";
import {
  OpenAiApiEndpoint,
  OpenAiApiMessage,
  OpenAiApiTool,
  OpenAiApiToolCall,
} from "./openAiApiTypes.ts";

export type AgentDefinition = {
  name: string;
  description: string;
  initialMessages: OpenAiApiMessage[];
  tools: Tool[];
  endpoint: OpenAiApiEndpoint;
};

export type Agent = {
  definition: AgentDefinition;
  messages: OpenAiApiMessage[];
  status: "coordinator" | { tool: string; toolCallId: string };
};

export type Tool = {
  definition: OpenAiApiTool;
  executor: (
    state: State,
    toolCall: OpenAiApiToolCall,
    debug: boolean
  ) => Promise<State>;
};

export type State = {
  agentStack: Agent[];
  agentDefinitions: AgentDefinition[];
  browser: {
    driver: ThenableWebDriver;
    selectedElement: WebElement;
  };
};
