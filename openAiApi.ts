import { OpenAiApiMessage, OpenAiApiTool } from "./types/openAiApiTypes.ts";

export const constructOpenAiApiRequestBody = (
  model: string,
  messages: OpenAiApiMessage[],
  tools: OpenAiApiTool[]
) => ({
  model,
  messages,
  tools,
  stream: false,
  max_tokens: 1024,
  tool_choice: "required",
});
