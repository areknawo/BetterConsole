import { PropType, Ref, defineComponent } from "vue";
import { StyleProps, merge, styleProps } from "~/src/utils/css";
import { Icon } from "./icon";

interface ButtonStyleProps extends StyleProps {
  color: "theme" | "dark" | "light" | "grayish" | "gradient" | "none";
  hoverBehavior: "background" | "scale" | "none";
  focusBehavior: "background" | "scale" | "none";
  margin: boolean;
  rounded: "default" | "md" | "lg" | "full";
  size: "sm" | "md" | "lg";
  variant: "icon" | "text";
}

const { getClass, getVueProps } = styleProps<ButtonStyleProps>([
  "transition focus:outline-none cursor-pointer disabled:opacity-50",
  ...merge<ButtonStyleProps>({ hoverBehavior: "background" }, [
    [{ color: ["theme", "grayish"] }, "hover:bg-gray-200 dark:hover:bg-gray-700"],
    [{ color: "light" }, "hover:bg-gray-700"],
    [{ color: "dark" }, "hover:bg-gray-200"]
  ]),
  ...merge<ButtonStyleProps>({ focusBehavior: "background" }, [
    [{ color: ["theme", "grayish"] }, "focus:bg-gray-200 dark:focus:bg-gray-700"],
    [{ color: "light" }, "focus:bg-gray-700"],
    [{ color: "dark" }, "focus:bg-gray-200"]
  ]),
  ...merge<ButtonStyleProps>({ variant: "text" }, [
    "flex items-center font-semibold",
    [{ rounded: "default" }, "rounded-2xl"],
    [{ color: ["theme", "grayish"] }, "text-gray-500 dark:text-gray-300"],
    [{ color: "light" }, "text-gray-300"],
    [{ color: "dark" }, "text-gray-500"],
    [{ color: "gradient" }, "bg-gradient-to-tr text-white"],
    [{ color: "grayish" }, "bg-gray-300 dark:bg-gray-700"],
    [{ size: ["md", "lg"], margin: true }, "px-2 py-1 mx-1"],
    [{ size: "sm", margin: true }, "px-0.5"]
  ]),
  ...merge<ButtonStyleProps>({ variant: "icon" }, [
    "flex justify-center items-center",
    [{ rounded: "default" }, "rounded-full"],
    [{ color: "theme" }, "text-gray-800 dark:text-white"],
    [{ color: "light" }, "text-white"],
    [{ color: "dark" }, "text-gray-800"],
    [{ color: "gradient" }, "bg-gradient-to-tr text-white"],
    [{ color: "grayish" }, "text-gray-500 dark:text-gray-300"],
    [{ size: "md", margin: true }, "p-1 m-1"],
    [{ size: "lg" }, "w-10"]
  ]),
  [{ rounded: "md" }, "rounded-lg"],
  [{ rounded: "lg" }, "rounded-2xl"],
  [{ rounded: "full" }, "rounded-full"],
  [{ hoverBehavior: "scale" }, "transform hover:scale-105 optimize-transform backface-hidden"],
  [{ focusBehavior: "scale" }, "transform focus:scale-105 optimize-transform backface-hidden"],
  [{ size: "sm" }, "text-sm"],
  [{ size: "lg" }, "text-xl h-10"]
]);
const Button = defineComponent({
  props: {
    tag: {
      default: "button",
      type: String
    },
    link: String,
    iconProps: Object as PropType<ComponentProps<typeof Icon>>,
    elementRef: [Object, String] as PropType<Ref<HTMLElement | null> | string>,
    ...getVueProps({
      color: "theme",
      hoverBehavior: "background",
      focusBehavior: "none",
      rounded: "default",
      margin: true,
      size: "md",
      variant: "text"
    })
  },
  setup(props, context) {
    return () => {
      const Tag = props.link ? "a" : props.tag;
      const children = context.slots.default?.();

      return (
        <Tag
          class={getClass(props)}
          href={props.link}
          target={props.link && "_blank"}
          ref={props.elementRef}
        >
          {props.iconProps && (
            <Icon
              {...{
                size: props.size === "lg" ? "md" : props.size,
                ...props.iconProps
              }}
            />
          )}
          {props.iconProps && children && props.variant === "text" ? (
            <span class="ml-1">{children}</span>
          ) : (
            children
          )}
        </Tag>
      );
    };
  }
});

export { Button };
