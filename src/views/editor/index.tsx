import { Editor } from "./editor";
import { createApp } from "vue";
import { loadStore } from "~/src/utils/store";

const load = async (): Promise<void> => {
  const element = document.querySelector("#root");

  await loadStore();

  if (element) {
    createApp(
      <Editor
        onContextmenu={(event: MouseEvent) => {
          event.preventDefault();

          return false;
        }}
      />
    ).mount(element);
  }
};

load();
