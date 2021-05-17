import { StyleProps, styleProps } from "~/src/utils/css";
import { defineComponent, ref } from "vue";
import clsx from "clsx";

interface TooltipStyleProps extends StyleProps {
  fixed: boolean;
  side: "bottom" | "right" | "left" | "top";
}

const { getClass, getVueProps } = styleProps<TooltipStyleProps>([
  "bg-gray-800 dark:bg-gray-100 text-gray-100 dark:text-gray-900 text-sm z-50 px-1.5 py-0.5 rounded-lg transform transition-transform whitespace-nowrap",
  [{ fixed: false, side: "bottom" }, "absolute top-full mt-0.5"],
  [{ fixed: true, side: "bottom" }, "fixed top-full -translate-y-4"],
  [{ fixed: false, side: "right" }, "absolute left-full ml-0.5"],
  [{ fixed: false, side: "top" }, "absolute bottom-full mb-0.5"],
  [{ fixed: false, side: "left" }, "absolute right-full mr-0.5"]
]);
const Tooltip = defineComponent({
  props: {
    disabled: {
      default: false,
      type: Boolean
    },
    containerClass: String,
    text: {
      required: true,
      type: String
    },
    ...getVueProps({
      fixed: false,
      side: "bottom"
    })
  },
  setup(props, context) {
    const isHovered = ref(false);

    return () => {
      return (
        <div class={props.containerClass || "relative flex justify-center items-center"}>
          <div
            onMouseenter={() => (isHovered.value = !props.disabled)}
            onMouseleave={() => (isHovered.value = false)}
          >
            {context.slots.default?.()}
          </div>
          <span
            class={clsx([isHovered.value ? "delay-200 scale-100" : "scale-0", getClass(props)])}
          >
            {props.text}
          </span>
        </div>
      );
    };
  }
});

export { Tooltip };
