export type OpenAiApiMessage =
  | OpenAiApiSystemMessage
  | OpenAiApiUserMessage
  | OpenAiApiAgentMessage
  | OpenAiApiToolCallMessage
  | OpenAiApiToolResultMessage;

export type OpenAiApiUserMessage = {
  role: "user";
  content: string;
};

export type OpenAiApiAgentMessage = {
  role: "assistant";
  content: string;
};

export type OpenAiApiSystemMessage = {
  role: "system";
  content: string;
};

export type OpenAiApiToolResultMessage = {
  role: "tool";
  content: string;
  tool_call_id: string;
};

export type OpenAiApiToolCallMessage = {
  role: "assistant";
  content: string;
  tool_calls: OpenAiApiToolCall[];
};

export type OpenAiApiTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, { type: string; description: string }>;
      required: string[];
    };
  };
};

export type OpenAiApiToolCall = {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
  type: "function";
};

export type OpenAiApiResponseMessage = {
  role: string;
  content: string;
  tool_calls: OpenAiApiToolCall[];
  refusal: string;
};

export type OpenAiApiResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAiApiResponseMessage;
    finish_reason: string;
  }[];
};

export type OpenAiApiEndpoint = {
  url: string;
  model: string;
  headers: [string, string][];
};
