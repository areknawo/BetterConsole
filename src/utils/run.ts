import { Store } from "~/src/utils/store";
import { compile } from "sass.js/dist/sass.sync";
import { transpileModule } from "typescript";

interface ExecutionCache {
  style: null | HTMLStyleElement;
  script: null | HTMLScriptElement;
  dom: ChildNode[];
}

const cache: ExecutionCache = { style: null, script: null, dom: [] };
const clearLastExecution = (): void => {
  if (cache.style) {
    cache.style.remove();
  }

  if (cache.script) {
    cache.script.remove();
  }

  cache.dom.forEach((node) => {
    node.remove();
  });
};
const processCSS = (store: Store): Promise<void> => {
  return new Promise((resolve) => {
    const style = document.createElement("style");

    cache.style = style;

    if (store.scssEnabled) {
      compile(store.css, (result: { text: string }) => {
        style.textContent = result.text;
        document.body.append(style);
        resolve();
      });
    } else {
      style.textContent = store.css;
      document.body.append(style);
      resolve();
    }
  });
};
const processJavaScript = (store: Store): void => {
  const script = document.createElement("script");

  cache.script = script;
  script.textContent = `(function(){${
    store.tsEnabled ? transpileModule(store.js, {}).outputText : store.js
  }})()`;
  document.body.append(script);
};
const processHTML = (store: Store): void => {
  const originalNodeCount = document.body.childNodes.length;

  document.body.insertAdjacentHTML("beforeend", store.html);
  cache.dom = [...document.body.childNodes].slice(originalNodeCount);
};
const execute = async (store: Store): Promise<void> => {
  clearLastExecution();
  await processCSS(store);
  processHTML(store);
  processJavaScript(store);
};

export { execute };
