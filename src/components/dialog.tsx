import { PropType, Ref, defineComponent, ref, watch } from "vue";
import { StyleProps, styleProps } from "~/src/utils/css";
import { Card } from "~/src/components/card";
import { Overlay } from "~/src/components/overlay";
import clsx from "clsx";

interface ActivatorProps {
  customProps: Record<string, unknown>;
}
interface ContentProps {
  opened: boolean;
  setOpened(value: boolean): void;
}
interface DialogStyleProps extends StyleProps {
  origin: "center" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const { getClass, getVueProps } = styleProps<DialogStyleProps>([
  "transition transform absolute z-50 duration-300 m-1",
  [{ origin: "center" }, "origin-center"],
  [{ origin: "bottom-left" }, "origin-bottom-left bottom-full left-0"],
  [{ origin: "bottom-right" }, "origin-bottom-right bottom-full right-0"],
  [{ origin: "top-left" }, "origin-top-left top-full left-0"],
  [{ origin: "top-right" }, "origin-top-right top-full right-0"]
]);
const Dialog = defineComponent({
  props: {
    absolute: Boolean,
    activator: Function as PropType<(props: ActivatorProps) => JSX.Element>,
    opened: Object as PropType<Ref<boolean>>,
    activatorActiveClassName: {
      default: "bg-white dark:bg-gray-800 z-50",
      type: String
    },
    elementRef: Object as PropType<Ref<HTMLElement | null>>,
    content: Function as PropType<(props: ContentProps) => JSX.Element>,
    ...getVueProps({})
  },
  setup(props, context) {
    const opened = props.opened || ref(false);
    const elevated = ref(false);
    const getDialogClass = (): string => {
      return opened.value ? "ease-out" : "ease-in scale-0 opacity-0";
    };
    const handleTransition = ({ type }: TransitionEvent): void => {
      if (type === "transitionstart" && opened.value) {
        elevated.value = true;
      } else if (type === "transitionend" && !opened.value) {
        elevated.value = false;
      }
    };

    watch(
      opened,
      (elevated) => {
        const { body } = document;

        if (elevated) {
          body.classList.add("dialog");
        } else {
          body.classList.remove("dialog");
        }
      },
      { immediate: true }
    );

    return () => {
      const Activator = props.activator;
      const Content = props.content;

      return (
        <div
          class={clsx(props.absolute ? "absolute" : "relative", "flex justify-center items-center")}
          ref={props.elementRef}
        >
          {Activator && (
            <Activator
              class={elevated.value ? props.activatorActiveClassName : ""}
              customProps={opened.value ? { hoverBehavior: "none" } : {}}
              onClick={() => {
                opened.value = true;
              }}
            />
          )}
          <Overlay
            absolute={props.absolute}
            opened={opened.value}
            origin={props.origin}
            onClick={(): void => {
              opened.value = !opened.value;
            }}
            onTransitionstart={handleTransition}
            onTransitionend={handleTransition}
          />
          <Card class={clsx([getClass(props), getDialogClass()])}>
            {Content ? (
              <Content
                opened={opened.value}
                setOpened={(value) => {
                  opened.value = value;
                }}
              />
            ) : (
              context.slots.default?.()
            )}
          </Card>
        </div>
      );
    };
  }
});

export { Dialog };
