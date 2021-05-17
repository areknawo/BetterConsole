import { browser } from "webextension-polyfill-ts";

browser.browserAction.onClicked.addListener(async () => {
  await browser.tabs.executeScript({ file: "/content/index.js" });
});
