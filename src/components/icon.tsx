import { StyleProps, styleProps } from "~/src/utils/css";
import clsx from "clsx";
import { defineComponent } from "vue";

interface IconStyleProps extends StyleProps {
  fill: "color" | "gradient";
  size: "sm" | "md" | "lg" | "xl";
}

const { getClass, getVueProps } = styleProps<IconStyleProps>([
  [{ size: "sm" }, "h-4 w-4"],
  [{ size: "md" }, "h-6 w-6"],
  [{ size: "lg" }, "h-7 w-7"],
  [{ size: "xl" }, "h-12 w-12"],
  [{ fill: "color" }, "fill-current"],
  [{ fill: "gradient" }, "fill-gradient"]
]);
const Icon = defineComponent({
  props: {
    class: String,
    path: {
      required: true,
      type: String
    },
    ...getVueProps({ fill: "color", size: "md" })
  },
  setup(props) {
    return () => {
      return (
        <svg
          class={clsx(getClass(props), props.class)}
          clip-rule="evenodd"
          fill-rule="evenodd"
          viewBox="0 0 24 24"
        >
          <path d={props.path} />
        </svg>
      );
    };
  }
});

export { Icon };
