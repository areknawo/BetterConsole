import { Encode, Hook } from "console-feed";

setTimeout(() => {
  Hook(
    window.console,
    (encodedLog) => {
      window.postMessage(encodedLog, "*");
    },
    true
  );
  window.addEventListener(
    "error",
    ({ message }) => {
      const encodedLog = Encode({
        method: "error",
        data: [message || "See DevTools console for more error info"]
      });

      window.postMessage(encodedLog, "*");
    },
    true
  );
}, 2000);
