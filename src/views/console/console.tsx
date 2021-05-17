import { Message as ComponentMessage, Props } from "console-feed/lib/definitions/Component";
import { Console, Decode, Encode } from "console-feed";
import React, { useEffect, useState } from "react";
import { Theme, loadStore } from "../../utils/store";
import { Message } from "console-feed/lib/definitions/Console";
import { Styles } from "console-feed/lib/definitions/Styles";
import { browser } from "webextension-polyfill-ts";
import { render } from "react-dom";

interface LogsContainerProps {
  theme: Theme;
}

const ConsoleOutput = (Console as unknown) as (props: Props) => JSX.Element;
const light: Styles = {
  BASE_FONT_FAMILY: "'Fira Code', monospace",

  LOG_COLOR: "#222222",
  LOG_ICON: "#222222",
  LOG_BACKGROUND: "transparent",
  LOG_ICON_BACKGROUND_SIZE: "transparent",
  LOG_BORDER: "#F0F0F0",
  LOG_AMOUNT_BACKGROUND: "#8097BD",
  LOG_AMOUNT_COLOR: "#FFFFFF",

  LOG_INFO_COLOR: "#222222",
  LOG_INFO_ICON: "#222222",
  LOG_INFO_BACKGROUND: "transparent",
  LOG_INFO_BORDER: "#F0F0F0",

  LOG_WARN_COLOR: "#5C3C00",
  LOG_WARN_BACKGROUND: "#FFFBE5",
  LOG_WARN_BORDER: "#FFF5C2",
  LOG_WARN_AMOUNT_BACKGROUND: "#8097BD",
  LOG_WARN_AMOUNT_COLOR: "FFFFFF",

  LOG_ERROR_COLOR: "#FF0000",
  LOG_ERROR_BACKGROUND: "#FFF0F0",
  LOG_ERROR_BORDER: "#FFD6D6",
  LOG_ERROR_AMOUNT_BACKGROUND: "#8097BD",
  LOG_ERROR_AMOUNT_COLOR: "#FFFFFF",

  LOG_DEBUG_BACKGROUND: "transparent",
  LOG_DEBUG_BORDER: "#F0F0F0",
  LOG_DEBUG_COLOR: "#222222",
  LOG_DEBUG_AMOUNT_BACKGROUND: "#8097BD",
  LOG_DEBUG_AMOUNT_COLOR: "#FFFFFF",

  BASE_BACKGROUND_COLOR: "transparent",
  BASE_COLOR: "#222222",

  ARROW_COLOR: "#727272",

  TABLE_BORDER_COLOR: "#CCCCCC",
  TABLE_TH_BACKGROUND_COLOR: "#F3F3F3",
  TABLE_TH_HOVER_COLOR: "#E6E6E6",
  TABLE_SORT_ICON_COLOR: "#6E6E6E",

  HTML_TAG_COLOR: "#A894A6",
  HTML_TAGNAME_COLOR: "#881280",
  HTML_TAGNAME_TEXT_TRANSFORM: "lowercase",
  HTML_ATTRIBUTE_NAME_COLOR: "#994500",
  HTML_ATTRIBUTE_VALUE_COLOR: "#1A1AA6",
  HTML_COMMENT_COLOR: "#236E25",
  HTML_DOCTYPE_COLOR: "#C0C0C0",

  OBJECT_NAME_COLOR: "#565656",
  OBJECT_VALUE_NULL_COLOR: "#5E5E5E",
  OBJECT_VALUE_UNDEFINED_COLOR: "#5E5E5E",
  OBJECT_VALUE_REGEXP_COLOR: "#C41A16",
  OBJECT_VALUE_STRING_COLOR: "#C41A16",
  OBJECT_VALUE_SYMBOL_COLOR: "#C41A16",
  OBJECT_VALUE_NUMBER_COLOR: "#1C00CF",
  OBJECT_VALUE_BOOLEAN_COLOR: "#0D22AA",
  OBJECT_VALUE_FUNCTION_KEYWORD_COLOR: "#AB0D90"
};
const dark: Styles = {
  BASE_FONT_FAMILY: "'Fira Code', monospace",

  LOG_COLOR: "#D5D5D5",
  LOG_ICON: "#D5D5D5",
  LOG_BACKGROUND: "transparent",
  LOG_ICON_BACKGROUND_SIZE: "transparent",
  LOG_BORDER: "#3A3A3A",
  LOG_AMOUNT_BACKGROUND: "#42597F",
  LOG_AMOUNT_COLOR: "#000000",

  LOG_INFO_COLOR: "#D5D5D5",
  LOG_INFO_ICON: "#D5D5D5",
  LOG_INFO_BACKGROUND: "transparent",
  LOG_INFO_BORDER: "#3A3A3A",

  LOG_WARN_COLOR: "#FFDD9E",
  LOG_WARN_BACKGROUND: "#332B00",
  LOG_WARN_BORDER: "#665500",
  LOG_WARN_AMOUNT_BACKGROUND: "#42597F",
  LOG_WARN_AMOUNT_COLOR: "000000",

  LOG_ERROR_COLOR: "#FF8080",
  LOG_ERROR_BACKGROUND: "#290000",
  LOG_ERROR_BORDER: "#5C0000",
  LOG_ERROR_AMOUNT_BACKGROUND: "#42597F",
  LOG_ERROR_AMOUNT_COLOR: "#000000",

  LOG_DEBUG_BACKGROUND: "transparent",
  LOG_DEBUG_BORDER: "#3A3A3A",
  LOG_DEBUG_COLOR: "#D5D5D5",
  LOG_DEBUG_AMOUNT_BACKGROUND: "#42597F",
  LOG_DEBUG_AMOUNT_COLOR: "#000000",

  BASE_BACKGROUND_COLOR: "transparent",
  BASE_COLOR: "#D5D5D5",

  ARROW_COLOR: "#919191",

  TABLE_BORDER_COLOR: "#3D3D3D",
  TABLE_TH_BACKGROUND_COLOR: "#292A2D",
  TABLE_TH_HOVER_COLOR: "#303030",
  TABLE_SORT_ICON_COLOR: "#919191",

  HTML_TAG_COLOR: "#5DB0D7",
  HTML_TAGNAME_COLOR: "#5DB0D7",
  HTML_TAGNAME_TEXT_TRANSFORM: "lowercase",
  HTML_ATTRIBUTE_NAME_COLOR: "#9BBBDC",
  HTML_ATTRIBUTE_VALUE_COLOR: "#F29766",
  HTML_COMMENT_COLOR: "#898989",
  HTML_DOCTYPE_COLOR: "#C0C0C0",

  OBJECT_NAME_COLOR: "#A9A9A9",
  OBJECT_VALUE_NULL_COLOR: "#A1A1A1",
  OBJECT_VALUE_UNDEFINED_COLOR: "#A1A1A1",
  OBJECT_VALUE_REGEXP_COLOR: "#F28B54",
  OBJECT_VALUE_STRING_COLOR: "#F28B54",
  OBJECT_VALUE_SYMBOL_COLOR: "#F28B54",
  OBJECT_VALUE_NUMBER_COLOR: "#9980FF",
  OBJECT_VALUE_BOOLEAN_COLOR: "#9980FF",
  OBJECT_VALUE_FUNCTION_KEYWORD_COLOR: "#9A7FD5"
};
const LogsContainer = ({ theme }: LogsContainerProps): JSX.Element => {
  const [logs, setLogs] = useState<Message[]>([]);

  useEffect(() => {
    browser.storage.local.get("logs").then(({ logs }) => {
      if (Array.isArray(logs)) {
        setLogs((logs as Array<Record<string, unknown>>).map((value) => Decode(value)));
      }
    });
    browser.runtime.onMessage.addListener((messages: unknown[]) => {
      if (Array.isArray(messages)) {
        setLogs([...logs, ...messages.map((message) => Decode(message))]);
      }
    });
  }, []);
  useEffect(() => {
    browser.storage.local.set({ logs: logs.map((value) => Encode(value)) });
  }, [logs]);

  return (
    <ConsoleOutput
      logs={logs as ComponentMessage[]}
      variant={theme === "light" ? "light" : "dark"}
      styles={theme === "light" ? light : dark}
    />
  );
};
const load = async (): Promise<void> => {
  const element = document.querySelector("#root");
  const store = await loadStore("console");

  if (store.theme !== "light") {
    document.documentElement.classList.add("dark");
  }

  if (element) {
    render(React.createElement(LogsContainer, { theme: store.theme }, null), element);
  }
};

load();
