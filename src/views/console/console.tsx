import { Message as ComponentMessage, Props } from "console-feed/lib/definitions/Component";
import { Console as ConsoleFeed, Decode, Encode } from "console-feed";
import React, { useEffect, useState } from "react";
import { Theme, getStore } from "../../utils/store";
import { dark, light } from "./themes";
import { defineComponent, h, onMounted, ref, watch } from "vue";
import { Message } from "console-feed/lib/definitions/Console";
import { render } from "react-dom";

interface LogsContainerProps {
  initialTheme: Theme;
}

const ReactConsoleFeed = (ConsoleFeed as unknown) as (props: Props) => JSX.Element;
const ReactLogsContainer = ({ initialTheme }: LogsContainerProps): JSX.Element => {
  const [logs, setLogs] = useState<Message[]>([]);
  const [fromInside, setFromInside] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const store = getStore();

    watch(
      () => store.logs,
      (logs) => {
        let clearIndex = -1;

        if (fromInside) {
          return;
        }

        const decodedLogs = (logs as Array<Record<string, unknown>>)
          .map((value) => {
            try {
              return Decode(value);
            } catch {
              return null;
            }
          })
          .filter((v, index) => {
            if (v?.method === "clear") {
              clearIndex = index;
            }

            return v && v.data;
          })
          .slice(clearIndex + 1) as Message[];

        if (clearIndex >= 0) {
          store.logs = decodedLogs.map((log) => Encode(log));
          setFromInside(true);
        }

        setLogs(decodedLogs);
      },
      { immediate: true }
    );
    watch(
      () => store.theme,
      (theme) => {
        setTheme(theme);
      },
      { immediate: true }
    );
  }, []);

  return (
    <ReactConsoleFeed
      key={theme}
      logs={logs as ComponentMessage[]}
      variant={theme === "light" ? "light" : "dark"}
      styles={theme === "light" ? light : dark}
    />
  );
};
const Console = defineComponent({
  setup() {
    const store = getStore();
    const containerRef = ref<HTMLElement | null>(null);
    const updateTheme = (): void => {
      if (store.theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    };

    watch(
      () => store.theme,
      () => {
        updateTheme();
      }
    );
    updateTheme();
    onMounted(() => {
      if (containerRef.value) {
        render(
          React.createElement(ReactLogsContainer, { initialTheme: store.theme }, null),
          containerRef.value
        );
      }
    });

    return () => {
      return h("div", { class: "h-full pb-12 overflow-y-auto", ref: containerRef });
    };
  }
});

export { Console };
