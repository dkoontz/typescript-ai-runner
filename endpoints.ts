import { OpenAiApiEndpoint } from "./types/openAiApiTypes.ts";

export const ollamaLlama31_8bInstruct: OpenAiApiEndpoint = {
  url: "http://localhost:11434/api/chat",
  model: "llama3.1:8b-instruct-q4_0",
  headers: [],
};

export const ollamaLlama31_70bInstruct: OpenAiApiEndpoint = {
  url: "http://localhost:11434/api/chat",
  model: "llama3.1:70b-instruct-q4_0",
  headers: [],
};

export const openAiGpt4oMini: OpenAiApiEndpoint = {
  url: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4o-mini",
  headers: [["Authorization", `Bearer ${Deno.env.get("OPENAI_API_KEY")}`]],
};

export const openAiGpt4o: OpenAiApiEndpoint = {
  url: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4o",
  headers: [["Authorization", `Bearer ${Deno.env.get("OPENAI_API_KEY")}`]],
};

export const claude35Sonnet: OpenAiApiEndpoint = {
  url: "https://api.anthropic.com/v1/messages",
  model: "claude-3-5-sonnet-20240620",
  headers: [
    ["x-api-key", Deno.env.get("ANTHROPIC_API_KEY") || ""],
    ["anthropic-version", "2023-06-01"],
  ],
};
