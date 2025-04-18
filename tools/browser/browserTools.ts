import { Tool } from "../../types/agentTypes.ts";
import { OpenAiApiTool } from "../../types/openAiApiTypes.ts";
import * as BrowserFunctions from "./browserFunctions.ts";

export const browserSelectElementByTextDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "browser_select_element_by_text",
    description:
      "Attempts to select an HTML element that contains the provided text. That element will be stay selected for use by subsequent actions. This tool should be used when there is an element that contains some specific text on the page that you want to interact with in a later step. Don't use this tool if the text is not directly part of an element, for example preview text or text that is part of an image.",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to locate on the page",
        },
        elementType: {
          type: "string",
          description:
            "The type of element to select, for example 'button', 'input', 'a', 'div', etc.",
        },
      },
      required: ["text"],
    },
  },
};

export const browserSelectElementByPlaceholderTextDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "browser_select_element_by_placeholder_text",
    description:
      "Attempts to select an HTML element that contains the provided placeholder text. That element will be stay selected for use by subsequent actions. This tool should be used when there is an input element that has specific placeholder text and has not been typed into yet that you want to select so that you can interact with it in a later step.",
    parameters: {
      type: "object",
      properties: {
        placeholder_text: {
          type: "string",
          description: "The placeholder text to locate on the page",
        },
      },
      required: ["placeholder_text"],
    },
  },
};

export const browserNavigateToPageDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "browser_navigate_to_page",
    description:
      "Navigates the browser to the specified URL. Use this tool when you wan to send the browser to a new page, do not use this tool if you are interacting with elements on the page.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to navigate to",
        },
      },
      required: ["url"],
    },
  },
};

export const browserClickOnElementDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "browser_click_on_element",
    description:
      "Clicks on the currently selected HTML element. This will fail if a page element has not already been selected. Use this when you have previously selected an element and now you want to click on it.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export const browserTypeTextDefinition: OpenAiApiTool = {
  type: "function",
  function: {
    name: "browser_type_text",
    description:
      "Enters the provided text into the currently selected HTML element. Be sure to select an element before entering text. Use this tool when you need to enter text into a form field on the page.",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to enter into the selected element",
        },
      },
      required: ["text"],
    },
  },
};

export const browserNavigateToPage: Tool = {
  definition: browserNavigateToPageDefinition,
  executor: BrowserFunctions.processBrowserNavigateToPage,
};

export const browserClickOnElement: Tool = {
  definition: browserClickOnElementDefinition,
  executor: BrowserFunctions.processBrowserClickOnElement,
};

export const browserTypeText: Tool = {
  definition: browserTypeTextDefinition,
  executor: BrowserFunctions.processBrowserTypeText,
};

export const browserSelectElementByText: Tool = {
  definition: browserSelectElementByTextDefinition,
  executor: BrowserFunctions.processBrowserSelectElementByText,
};

export const browserSelectElementByPlaceholderText: Tool = {
  definition: browserSelectElementByPlaceholderTextDefinition,
  executor: BrowserFunctions.processBrowserSelectElementByPlaceholderText,
};
