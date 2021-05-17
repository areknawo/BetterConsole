import { createApp, defineComponent, ref, shallowRef } from "vue";
import { getStore, loadStore } from "~/src/utils/store";
import { App } from "./app";
import { browser } from "webextension-polyfill-ts";
import clsx from "clsx";
import { setupIsMoving } from "~/src/utils/context";

const container = document.createElement("div");
const shadowRoot = container.attachShadow({ mode: "open" });
const setupConsolePass = (): void => {
  const store = getStore();
  const buffer = shallowRef<unknown[]>([]);
  const throttle = ref(0);
  const timeout = 300;

  window.addEventListener("message", (event) => {
    clearTimeout(throttle.value);
    buffer.value = [...buffer.value, event.data];
    throttle.value = setTimeout(() => {
      store.logs = [...store.logs, ...buffer.value];
      buffer.value = [];
    }, timeout);
  });
};
const load = async (): Promise<void> => {
  const store = await loadStore();

  document.body.append(container);
  container.setAttribute("style", "all:initial;z-index:9999999999999999999999999999");
  createApp(
    defineComponent(() => {
      const isTailwindLoaded = ref(false);
      const isCSSLoaded = ref(false);

      setupConsolePass();
      setupIsMoving();

      return () => (
        <div
          id="root"
          class={clsx({ dark: store.theme === "dark" }, store.color)}
          onContextmenu={(event) => {
            event.preventDefault();

            return false;
          }}
        >
          <link
            rel="stylesheet"
            href={browser.runtime.getURL("tailwind.css")}
            onLoad={() => {
              isTailwindLoaded.value = true;
            }}
          />
          <link
            rel="stylesheet"
            href={browser.runtime.getURL("style.css")}
            onLoad={() => {
              isCSSLoaded.value = true;
            }}
          />
          {isCSSLoaded.value && isTailwindLoaded.value && <App />}
        </div>
      );
    })
  ).mount((shadowRoot as unknown) as HTMLElement);
};

load();
