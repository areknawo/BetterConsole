import {
  CSSProperties,
  FunctionalComponent,
  PropType,
  Ref,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { EdgeOptions, Interactable } from "@interactjs/types";
import { mdiArrowTopLeftBottomRight, mdiClose } from "@mdi/js";
import { Button } from "~/src/components/button";
import { Card } from "~/src/components/card";
import { Gradient } from "~/src/components/gradient";
import { Logo } from "~/src/components/logo";
import { Tooltip } from "~/src/components/tooltip";
import clsx from "clsx";
import { getStore } from "~/src/utils/store";
import interact from "interactjs";
import { useIsMoving } from "~/src/utils/context";

interface ResizeData {
  height: number;
  width: number;
}

type Direction = "tr" | "tl" | "br" | "bl";
type ResizeHandler = (data: ResizeData) => void;

interface Position {
  direction: Direction;
  x: number;
  y: number;
}
interface Size {
  height: number;
  width: number;
}
interface BubbleState {
  bubble: Ref<HTMLElement | null>;
  card: Ref<HTMLElement | null>;
  container: Ref<HTMLElement | null>;
  isOpened: Ref<boolean>;
  position: Position;
  size: Size;
}

const inBounds = (value: number, min: number, max: number): number => {
  if (value > max) {
    return max;
  } else if (value < min) {
    return min;
  }

  return value;
};
const useDraggable = ({ card, container, position }: BubbleState, margin: number): void => {
  const updateBubblePosition = (clientX?: number, clientY?: number): void => {
    const scrollbarXWidth = innerWidth - document.documentElement.clientWidth;
    const scrollbarYWidth = innerHeight - document.documentElement.clientHeight;

    position.x = inBounds(
      clientX ? clientX - 32 : position.x,
      8,
      window.innerWidth - 8 - 64 - scrollbarXWidth
    );
    position.y = inBounds(
      clientY ? clientY - 32 : position.y,
      8,
      window.innerHeight - 8 - 64 - scrollbarYWidth
    );
    position.direction = `${position.y > window.innerHeight / 2 ? "t" : "b"}${
      position.x > window.innerWidth / 2 ? "l" : "r"
    }` as Direction;

    if (container.value) {
      container.value.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  };

  onMounted(() => {
    const element = container.value;

    if (!element) return;

    element.style.transform = `translate(${position.x}px, ${position.y}px)`;
    window.addEventListener("resize", () => {
      updateBubblePosition();
    });
    interact(element)
      .draggable({
        inertia: {
          smoothEndDuration: 300,
          resistance: 2
        },
        ignoreFrom: card.value || "",
        listeners: {
          move(event: Interact.InteractEvent) {
            updateBubblePosition(event.clientX, event.clientY);
          }
        }
      })
      .styleCursor(false);
  });
};
const getResizeEdges = (direction: Position["direction"]): EdgeOptions => {
  const getHandle = (directionMatcher: string): string | boolean => {
    return direction.includes(directionMatcher) && "#resize-handle";
  };

  return {
    top: getHandle("t"),
    bottom: getHandle("b"),
    left: getHandle("l"),
    right: getHandle("r")
  };
};
const getContainerStyles = ({ direction, x, y }: Position): CSSProperties => {
  const scrollbarXWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollbarYWidth = window.innerHeight - document.documentElement.clientHeight;
  const maxWidthRight = `calc(100vw - ${x}px - 64px + 12px - 8px - ${scrollbarXWidth}px)`;
  const maxWidthLeft = `calc(${x}px + 12px - 8px)`;
  const maxHeightBottom = `calc(100vh - ${y}px - 64px + 12px - 8px - ${scrollbarYWidth}px)`;
  const maxHeightTop = `calc(${y}px + 12px - 8px)`;

  return {
    maxHeight: direction.includes("b") ? maxHeightBottom : maxHeightTop,
    maxWidth: direction.includes("r") ? maxWidthRight : maxWidthLeft
  };
};
const useResizeable = (
  { card, position, size }: BubbleState,
  onResize: ResizeHandler
): Ref<boolean> => {
  const isResizing = ref(false);
  const resizeDirection = ref<Direction>("br");
  const windowResizeTimeout = ref(0);
  const interactable = ref<Interactable | null>(null);
  const setSize = (height?: number, width?: number): void => {
    const minHeight = 400;
    const minWidth = 500;

    size.height = Math.max(height || size.height, minHeight);
    size.width = Math.max(width || size.width, minWidth);

    if (card.value) {
      Object.assign(card.value.style, {
        width: `${size.width}px`,
        height: `${size.height}px`
      });
    }
  };

  onMounted(() => {
    const element = card.value;

    if (!element) return;

    setSize();
    interactable.value = interact(element)
      .resizable({
        edges: getResizeEdges(position.direction),
        allowFrom: "#resize-handle",
        inertia: true,
        listeners: {
          start() {
            isResizing.value = true;
          },
          end() {
            const rect = element.getBoundingClientRect();

            isResizing.value = false;
            onResize({
              height: rect.height,
              width: rect.width
            });
          },
          move(event) {
            setSize(event.rect.height, event.rect.width);
          }
        }
      })
      .styleCursor(false);
  });
  window.addEventListener("resize", () => {
    isResizing.value = true;
    clearTimeout(windowResizeTimeout.value);
    windowResizeTimeout.value = setTimeout(() => {
      if (card.value) {
        const rect = card.value.getBoundingClientRect();

        isResizing.value = false;
        onResize({
          height: rect.height,
          width: rect.width
        });
      }
    }, 500);
  });
  watch(position, ({ direction }) => {
    if (resizeDirection.value !== direction) {
      resizeDirection.value = direction;
      interactable.value?.set({
        resize: {
          edges: getResizeEdges(position.direction)
        }
      });
    }
  });

  return isResizing;
};
const getResizeTooltipSide = (position: Direction): "left" | "right" => {
  if (position === "br" || position === "tr") {
    return "left";
  }

  return "right";
};
const ResizeHandle: FunctionalComponent<{ direction: Direction }> = ({ direction }) => {
  return (
    <Tooltip
      text="Resize"
      side={getResizeTooltipSide(direction)}
      containerClass={clsx({
        "top-0 left-0": direction === "tl",
        "top-0 right-0": direction === "tr",
        "bottom-0 left-0": direction === "bl",
        "bottom-0 right-0": direction === "br",
        "absolute flex justify-center items-center": true
      })}
    >
      <Button
        variant="icon"
        id="resize-handle"
        margin={false}
        iconProps={{ path: mdiArrowTopLeftBottomRight }}
        class={clsx({
          "transform rotate-90": direction === "bl" || direction === "tr",
          "p-1": true
        })}
        hoverBehavior="scale"
        color="grayish"
      />
    </Tooltip>
  );
};
const BubbleButton = defineComponent({
  props: {
    ref: Object as PropType<Ref<HTMLElement | null>>,
    handleClick: Function as PropType<() => void>
  },
  setup(props) {
    const isHovered = ref(false);

    return () => {
      return (
        <>
          <Button
            class="h-16 w-16 shadow-2xl overflow-hidden"
            style={{ touchAction: "none", userSelect: "none" }}
            elementRef={props.ref}
            color="gradient"
            variant="icon"
            size="lg"
            margin={false}
            onMouseenter={() => {
              isHovered.value = true;
            }}
            onMouseleave={() => {
              isHovered.value = false;
            }}
            onClick={props.handleClick}
          >
            <Logo class="h-full w-full m-2" />
          </Button>
          <Button
            color="grayish"
            variant="icon"
            class={clsx(
              "absolute -right-1 -top-1 shadow-lg bg-gray-300 dark:bg-gray-700",
              !isHovered.value && "scale-0"
            )}
            hoverBehavior="scale"
            size="sm"
            iconProps={{ path: mdiClose, size: "md" }}
          />
        </>
      );
    };
  }
});
const setupBubbleState = (margin: number): BubbleState => {
  const store = getStore();
  const bubble = ref<HTMLElement | null>(null);
  const card = ref<HTMLElement | null>(null);
  const container = ref<HTMLElement | null>(null);
  const isOpened = ref(true);
  const position = reactive<Position>({
    direction: store.direction || "br",
    x: store.x || margin,
    y: store.y || margin
  });
  const size = reactive<Size>({
    height: store.height,
    width: store.width
  });

  watch(position, ({ x, y, direction }) => {
    store.x = x;
    store.y = y;
    store.direction = direction;
  });
  watch(size, ({ height, width }) => {
    store.height = height;
    store.width = width;
  });

  return {
    bubble,
    card,
    container,
    isOpened,
    position,
    size
  };
};
const Bubble = defineComponent({
  props: {
    onResize: {
      type: Function as PropType<ResizeHandler>,
      required: true
    }
  },
  setup(props, context) {
    const margin = 8;
    const state = setupBubbleState(margin);
    const { bubble, card, container, isOpened, position } = state;
    const isResizing = useResizeable(state, props.onResize);
    const handleBubbleClick = (): void => {
      isOpened.value = !isOpened.value;
    };
    const isMoving = useIsMoving();

    useDraggable(state, margin);
    watch(position, () => {
      isOpened.value = false;
    });

    return () => {
      return (
        <div class="fixed top-0 left-0 z-full w-0 h-0 h-16 w-16 group" ref={container}>
          <Gradient />
          <BubbleButton ref={bubble} handleClick={handleBubbleClick} />
          <div
            class={clsx({
              "absolute h-0 w-0 -z-1": true,
              "top-3 left-3": position.direction === "tl",
              "top-3 right-3": position.direction === "tr",
              "bottom-3 left-3": position.direction === "bl",
              "bottom-3 right-3": position.direction === "br"
            })}
          >
            <div
              class={clsx("h-100 w-125 table transform duration-300 transition", {
                "hidden": isMoving.value && !isOpened.value,
                "scale-0": !isOpened.value,
                "origin-top-left": position.direction === "br",
                "-translate-y-full origin-bottom-left": position.direction === "tr",
                "-translate-x-full origin-top-right": position.direction === "bl",
                "-translate-y-full -translate-x-full origin-bottom-right":
                  position.direction === "tl"
              })}
              style={getContainerStyles(position)}
              ref={card}
            >
              <Card
                background={false}
                class={clsx(
                  "h-full w-full shadow-2xl rounded-2xl transform transition",
                  isResizing.value ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <div
                  class={clsx(
                    "w-full h-full relative rounded-2xl overflow-hidden",
                    isResizing.value && "hidden"
                  )}
                >
                  {context.slots.default?.()}
                </div>
              </Card>
              <ResizeHandle direction={position.direction} />
            </div>
          </div>
        </div>
      );
    };
  }
});

export { Bubble, ResizeHandler };
