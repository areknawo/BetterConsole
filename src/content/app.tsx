import { Bubble, ResizeHandler } from "./bubble";
import { PropType, Ref, computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import {
  mdiDragVerticalVariant,
  mdiFormatHorizontalAlignCenter,
  mdiFormatHorizontalAlignLeft,
  mdiFormatHorizontalAlignRight,
  mdiSync
} from "@mdi/js";
import { Button } from "~/src/components/button";
import { Menu } from "./menu";
import { Size } from "@interactjs/types";
import { Tooltip } from "~/src/components/tooltip";
import { browser } from "webextension-polyfill-ts";
import clsx from "clsx";
import { getStore } from "~/src/utils/store";
import interact from "interactjs";

type PanelType = "editor" | "console";

interface PanelState {
  loaded: boolean;
  type: PanelType;
}
interface AppState {
  containerRef: Ref<HTMLElement | null>;
  containerWidth: Ref<number>;
  leftPanel: PanelState;
  leftPanelRef: Ref<HTMLElement | null>;
  render: Ref<boolean>;
  rightPanel: PanelState;
  rightPanelRef: Ref<HTMLElement | null>;
  rightPanelWidth: Ref<number>;
}

const getPanelSource = (type: PanelType): string => {
  const editorSource = browser.runtime.getURL("views/editor/index.html");
  const consoleSource = browser.runtime.getURL("views/console/index.html");

  return type === "console" ? consoleSource : editorSource;
};
const getPanelLabel = (type: PanelType): string => {
  return type === "console" ? "Console" : "Editor";
};
const setupResize = (state: AppState): ResizeHandler => {
  const interactable = ref<ReturnType<typeof interact> | null>(null);

  watch(
    [state.containerWidth, state.rightPanelWidth, state.rightPanelRef, state.leftPanelRef],
    ([containerWidth, rightPanelWidth, rightPanel, leftPanel]) => {
      if (rightPanel && leftPanel) {
        Object.assign(rightPanel.style, {
          minWidth: "32px",
          maxWidth: `${containerWidth}px`,
          width: `calc(${(rightPanelWidth / containerWidth) * 100}% + 16px)`
        });
        Object.assign(leftPanel.style, {
          minWidth: "0",
          maxWidth: `calc(${containerWidth}px - 32px)`,
          width: `calc(${((containerWidth - rightPanelWidth) / containerWidth) * 100}% - 16px)`
        });
      }
    }
  );
  onMounted(() => {
    if (state.rightPanelRef.value) {
      interactable.value = interact(state.rightPanelRef.value).resizable({
        edges: {
          left: "#split-handle"
        },
        allowFrom: "#split-handle",
        listeners: {
          start() {
            state.render.value = false;
          },
          end() {
            state.render.value = true;
          },
          move(event) {
            state.rightPanelWidth.value = event.rect.width;
          }
        },
        modifiers: [
          interact.modifiers.restrictSize({
            max: { width: state.containerWidth.value } as Size
          })
        ]
      });
    }
  });

  return ({ width }) => {
    const multiplier = (width || state.containerWidth.value) / state.containerWidth.value;

    state.containerWidth.value = width || state.containerWidth.value;
    state.rightPanelWidth.value = Math.min(
      state.containerWidth.value,
      state.rightPanelWidth.value * multiplier
    );

    if (interactable.value) {
      interactable.value.resizable({
        modifiers: [
          interact.modifiers.restrictSize({
            max: { width: state.containerWidth.value } as Size
          })
        ]
      });
    }
  };
};
const setupState = (): AppState => {
  const store = getStore();
  const containerRef = ref<HTMLElement | null>(null);
  const rightPanelRef = ref<HTMLElement | null>(null);
  const leftPanelRef = ref<HTMLElement | null>(null);
  const leftPanel = reactive<PanelState>({
    loaded: false,
    type: store.rightPanelType === "editor" ? "console" : "editor"
  });
  const rightPanel = reactive<PanelState>({
    loaded: false,
    type: store.rightPanelType
  });
  const containerWidth = computed<number>({
    get() {
      return store.containerWidth;
    },
    set(value) {
      store.containerWidth = value;
    }
  });
  const rightPanelWidth = computed<number>({
    get() {
      return store.rightPanelWidth;
    },
    set(value) {
      store.rightPanelWidth = value;
    }
  });
  const render = ref(true);

  watch(rightPanel, (rightPanel) => {
    store.rightPanelType = rightPanel.type;
  });

  return {
    containerRef,
    containerWidth,
    leftPanel,
    leftPanelRef,
    render,
    rightPanel,
    rightPanelRef,
    rightPanelWidth
  };
};
const ResizeMenu = defineComponent({
  props: {
    state: {
      required: true,
      type: Object as PropType<AppState>
    }
  },
  setup(props) {
    return () => {
      const { containerWidth, leftPanel, rightPanel, rightPanelWidth } = props.state;

      const tooltipsRight = rightPanelWidth.value >= containerWidth.value / 2;

      return (
        <div
          class="z-10 absolute left-0 h-full w-8 flex flex-col justify-center items-center"
          id="split-handle"
        >
          {[
            {
              icon: mdiSync,
              label: "Switch views",
              onClick() {
                const previousRightPanelType = rightPanel.type;

                Object.assign(rightPanel, {
                  loaded: false,
                  type: leftPanel.type
                });
                Object.assign(leftPanel, {
                  loaded: false,
                  type: previousRightPanelType
                });
              }
            },
            {
              icon: mdiFormatHorizontalAlignLeft,
              label: "To left",
              onClick() {
                rightPanelWidth.value = containerWidth.value;
              }
            },

            { icon: mdiDragVerticalVariant, size: "lg" as const, iconSize: "xl" as const },

            {
              icon: mdiFormatHorizontalAlignRight,
              label: "To right",
              onClick() {
                rightPanelWidth.value = 0;
              }
            },
            {
              icon: mdiFormatHorizontalAlignCenter,
              label: "Center",
              onClick() {
                rightPanelWidth.value = containerWidth.value / 2;
              }
            }
          ].map(({ icon, size, iconSize, onClick, label }) => {
            return (
              <Tooltip text={label || ""} disabled={!label} side={tooltipsRight ? "right" : "left"}>
                <Button
                  variant="icon"
                  margin={false}
                  hoverBehavior="scale"
                  color="grayish"
                  class={size === "lg" ? "my-4" : "my-1"}
                  size={size || "md"}
                  iconProps={{ path: icon, size: iconSize || "md" }}
                  onClick={onClick}
                />
              </Tooltip>
            );
          })}
        </div>
      );
    };
  }
});
const App = defineComponent({
  setup() {
    const state = setupState();
    const onResize = setupResize(state);

    return () => (
      <>
        <Bubble onResize={onResize}>
          <div class="w-full h-full relative flex" ref={state.containerRef}>
            <div
              class={clsx(
                "relative top-0 left-0 h-full rounded-2xl flex justify-center items-center overflow-hidden bg-gray-100 dark:bg-gray-800"
              )}
              ref={state.leftPanelRef}
            >
              <iframe
                class={clsx(
                  "h-full w-full rounded-2xl",
                  (!state.render.value || !state.leftPanel.loaded) && "hidden"
                )}
                src={getPanelSource(state.leftPanel.type)}
                onLoad={() => {
                  state.leftPanel.loaded = true;
                }}
              />
              <span
                class={clsx(
                  "text-gray-500 dark:text-gray-300 absolute text-white font-semibold text-xl",
                  state.render.value && state.leftPanel.loaded && "hidden"
                )}
              >
                {getPanelLabel(state.leftPanel.type)}
              </span>
            </div>
            <div class="top-0 right-0 h-full rounded-2xl relative" ref={state.rightPanelRef}>
              <ResizeMenu state={state} />
              <div class="ml-8 relative h-full rounded-2xl overflow-hidden">
                <div
                  class={clsx(
                    "w-full h-full rounded-2xl flex justify-center items-center bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <iframe
                    id="console-frame"
                    class={clsx(
                      "w-full h-full rounded-2xl",
                      (!state.render.value || !state.rightPanel.loaded) && "hidden"
                    )}
                    src={getPanelSource(state.rightPanel.type)}
                    onLoad={() => {
                      state.rightPanel.loaded = true;
                    }}
                  />

                  <span
                    class={clsx(
                      "text-gray-500 dark:text-gray-300 absolute text-white font-semibold text-xl",
                      state.render.value && state.rightPanel.loaded && "hidden"
                    )}
                  >
                    {getPanelLabel(state.rightPanel.type)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Menu />
        </Bubble>
        <script src={browser.runtime.getURL("utils/console.js")} />
      </>
    );
  }
});

export { App };
