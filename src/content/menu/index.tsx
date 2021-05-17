import { defineComponent, ref } from "vue";
import {
  mdiCancel,
  mdiCodeTagsCheck,
  mdiCogOutline,
  mdiPlayCircleOutline,
  mdiRefresh
} from "@mdi/js";
import { Button } from "~/src/components/button";
import { Dialog } from "~/src/components/dialog";
import { FormItem } from "~/src/components/form-item";
import { Settings } from "./settings";
import { Tooltip } from "~/src/components/tooltip";
import clsx from "clsx";
import { cssIcon } from "~/src/assets/icons/css";
import { htmlIcon } from "~/src/assets/icons/html";
import { javascriptIcon } from "~/src/assets/icons/javascript";
import { sassIcon } from "~/src/assets/icons/sass";
import { typescriptIcon } from "~/src/assets/icons/typescript";
import { getStore } from "~/src/utils/store";
import { languages } from "monaco-editor";
import html = languages.html;
import { formatCode } from "~/src/utils/format";
import { execute } from "~/src/utils/run";

interface ButtonMenuItem {
  icon: string;
  gradient?: boolean;
  label: string;
  type?: "button";
  onClick?(): void;
}
interface FormMenuItem {
  type: "form";
  values?: string[];
  getValue(): string;
  setValue(value: string): void;
}

type MenuItem = ButtonMenuItem | FormMenuItem;

const Menu = defineComponent({
  setup() {
    const store = getStore();
    const isSettingsOpened = ref(false);
    const isModeOpened = ref(false);
    const getCurrentModeIcon = (): string => {
      if (store.mode === "js") {
        return store.tsEnabled ? typescriptIcon : javascriptIcon;
      } else if (store.mode === "css") {
        return store.scssEnabled ? sassIcon : cssIcon;
      }

      return htmlIcon;
    };
    const getEditorLanguage = (): string => {
      if (store.mode === "js") {
        return store.tsEnabled ? "typescript" : "javascript";
      } else if (store.mode === "css") {
        return store.scssEnabled ? "scss" : "css";
      }

      return "html";
    };
    const menu: MenuItem[] = [
      {
        icon: mdiCogOutline,
        label: "Settings",
        onClick() {
          isSettingsOpened.value = true;
        }
      },
      {
        icon: mdiCancel,
        label: "Clear console",
        onClick() {
          store.logs = [];
        }
      },
      {
        icon: mdiPlayCircleOutline,
        label: "Run",
        gradient: true,
        onClick() {
          execute(store);
        }
      },
      {
        icon: mdiCodeTagsCheck,
        label: "Format",
        onClick() {
          const formattedCode = formatCode(store[store.mode], getEditorLanguage());

          if (formattedCode) {
            store[store.mode] = formattedCode;
          }
        }
      }
    ];

    return () => {
      return (
        <div
          class={clsx(
            "absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-hidden rounded-2xl",
            isModeOpened.value || isSettingsOpened.value ? "" : "pointer-events-none"
          )}
        >
          <div
            class={clsx(
              "pointer-events-auto z-full w-full rounded-2xl absolute bottom-2 flex justify-center items-center hover:opacity-100",
              isModeOpened.value || isSettingsOpened.value ? "" : "opacity-50 "
            )}
          >
            <div class="bg-gray-200 dark:bg-gray-700 shadow-lg max-w-sm rounded-2xl flex justify-center items-center mx-2">
              {menu.map((item) => {
                return item.type === "form" ? (
                  <FormItem
                    possibleValues={item.values}
                    getValue={item.getValue}
                    setValue={item.setValue}
                  />
                ) : (
                  <Tooltip text={item.label} side="top">
                    <Button
                      variant="icon"
                      size="lg"
                      iconProps={{ path: item.icon }}
                      color={item.gradient ? "gradient" : "grayish"}
                      onClick={item.onClick}
                    />
                  </Tooltip>
                );
              })}
              <Dialog
                activator={() => {
                  return (
                    <Tooltip text="Language" side="top">
                      <Button
                        variant="icon"
                        size="lg"
                        iconProps={{ path: getCurrentModeIcon() }}
                        color="grayish"
                        onClick={() => {
                          isModeOpened.value = true;
                        }}
                      />
                    </Tooltip>
                  );
                }}
                opened={isModeOpened}
                origin="bottom-right"
              >
                <ul class="flex flex-col">
                  {[
                    {
                      icon: store.scssEnabled ? sassIcon : cssIcon,
                      label: store.scssEnabled ? "SCSS" : "CSS",
                      id: "css"
                    },
                    {
                      icon: store.tsEnabled ? typescriptIcon : javascriptIcon,
                      label: store.tsEnabled ? "TypeScript" : "JavaScript",
                      id: "js"
                    },
                    { icon: htmlIcon, label: "HTML", id: "html" }
                  ].map((item) => {
                    return (
                      <li class="flex flex-1">
                        <Button
                          class="flex-1 px-2 py-1"
                          iconProps={{ path: item.icon }}
                          margin={false}
                          color={item.id === store.mode ? "gradient" : "theme"}
                          onClick={() => {
                            store.mode = item.id;
                            setTimeout(() => {
                              isModeOpened.value = false;
                            }, 300);
                          }}
                        >
                          {item.label}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </Dialog>
            </div>
          </div>
          <Dialog
            opened={isSettingsOpened}
            origin="center"
            class="h-full w-full text-gray-900 dark:text-white"
          >
            <Settings />
          </Dialog>
        </div>
      );
    };
  }
});

export { Menu };
