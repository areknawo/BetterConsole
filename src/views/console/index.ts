import { createApp, h } from "vue";
import { Console } from "./console";
import { loadStore } from "../../utils/store";

const load = async (): Promise<void> => {
  const element = document.querySelector("#root");

  await loadStore();

  if (element) {
    createApp(
      h(Console, {
        onContextmenu(event: MouseEvent) {
          event.preventDefault();

          return false;
        }
      })
    ).mount(element);
  }
};

load();
