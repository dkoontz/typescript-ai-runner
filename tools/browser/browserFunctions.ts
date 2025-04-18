import { By } from "../../node_modules/selenium-webdriver/index.js";
import { State } from "../../types/agentTypes.ts";
import { OpenAiApiToolCall } from "../../types/openAiApiTypes.ts";
import * as AgentSystem from "../../agentSystem.ts";

export function processBrowserNavigateToPage(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  const toolCallArguments = JSON.parse(toolCall.function.arguments);
  const url = toolCallArguments["url"];

  AgentSystem.log(`Navigating to '${url}'`, debug);

  if (state.browser.driver === undefined) {
    return Promise.reject(new Error("Browser driver not initialized"));
  } else {
    return state.browser.driver
      .get(url)
      .then((_d) => {
        AgentSystem.log(`Completed navigation to '${url}'`, debug);
        return AgentSystem.applyToolResultAndGoToNextStep(
          toolCall.id,
          `Navigating to ${url} complete`,
          state,
          debug
        );
      })
      .catch((error) => {
        AgentSystem.log(`Failed to navigate to URL: ${error}`, debug);
        return AgentSystem.applyToolResultAndGoToNextStep(
          toolCall.id,
          `Failed to navigate to URL: ${error}`,
          state,
          debug
        );
      });
  }
}

export function processBrowserClickOnElement(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  AgentSystem.log(`Clicking on selected element`, debug);

  return state.browser.selectedElement
    .click()
    .then(() => {
      AgentSystem.log(`Successfully clicked on element`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        "Succesfully clicked on element",
        state,
        debug
      );
    })
    .catch((error) => {
      AgentSystem.log(`Failed to click on element: ${error}`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        `Failed to click on element element: ${error}`,
        state,
        debug
      );
    });
}

export function processBrowserTypeText(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  const toolCallArguments = JSON.parse(toolCall.function.arguments);
  const text = toolCallArguments["text"];

  AgentSystem.log(`Typing text '${text}' into selected element`, debug);

  return state.browser.selectedElement
    .sendKeys(text)
    .then(() => {
      AgentSystem.log(`Successfully typed text ${text} on element`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        `Successfully typed text ${text} on element`,
        state,
        debug
      );
    })
    .catch((error) => {
      AgentSystem.log(`Failed to type text: ${error}`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        `Failed to type text: ${error}`,
        state,
        debug
      );
    });
}

export function processBrowserSelectElementByText(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  const toolCallArguments = JSON.parse(toolCall.function.arguments);
  const text = toolCallArguments["text"];
  const elementType = toolCallArguments["elementType"] || "*";

  AgentSystem.log(`Selecting element that has text '${text}'`, debug);

  // This finds the login button in the console
  // document.evaluate("//button[text()=\"Login\"]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  return state.browser.driver
    .findElement(By.xpath(`//${elementType}[text()="${text}"]`))
    .then((element) => {
      const updatedState = {
        ...state,
        browser: {
          ...state.browser,
          selectedElement: element,
        },
      };

      AgentSystem.log(`Successfully selected element: ${element}`, debug);

      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        "Successfully selected element",
        updatedState,
        debug
      );
    })
    .catch((error) => {
      AgentSystem.log(`Failed to select element: ${error}`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        `Failed to select element: ${error}`,
        state,
        debug
      );
    });
}

export function processBrowserSelectElementByPlaceholderText(
  state: State,
  toolCall: OpenAiApiToolCall,
  debug: boolean
): Promise<State> {
  const toolCallArguments = JSON.parse(toolCall.function.arguments);
  const text = toolCallArguments["placeholder_text"];

  AgentSystem.log(
    `Selecting element that has the placeholder text '${text}'`,
    debug
  );

  return state.browser.driver
    .findElement(By.css(`[placeholder='${text}']`))
    .then((element) => {
      const updatedState = {
        ...state,
        browser: {
          ...state.browser,
          selectedElement: element,
        },
      };

      AgentSystem.log(`Successfully selected element: ${element}`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        "Successfully selected element",
        updatedState,
        debug
      );
    })
    .catch((error) => {
      AgentSystem.log(`Failed to select element: ${error}`, debug);
      return AgentSystem.applyToolResultAndGoToNextStep(
        toolCall.id,
        `Failed to select element: ${error}`,
        state,
        debug
      );
    });
}
