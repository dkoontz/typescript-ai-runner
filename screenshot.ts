import {
  Browser,
  Builder,
  Actions,
} from "./node_modules/selenium-webdriver/index.js";

async function takeScreenshot(driver, fileName) {
  return driver.takeScreenshot().then((data) => {
    const binaryData = atob(data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    Deno.writeFile(fileName, bytes);
  });
}

async function main() {
  const driver = new Builder().forBrowser(Browser.FIREFOX).build();
  await driver.get("https://cmp-app.avetta.com");
  await takeScreenshot(driver, "screenshot.png");
  await driver.quit();
}

main();
