import { PropType, defineComponent } from "vue";
import clsx from "clsx";

type Origin = "center" | "top-right" | "top-left" | "bottom-right" | "bottom-left";

const Overlay = defineComponent({
  props: {
    absolute: Boolean,
    opened: {
      required: true,
      type: Boolean
    },
    origin: {
      default: "center",
      type: String as PropType<Origin>
    }
  },
  setup(props) {
    const getOverlayClass = (): string => {
      const openedClass = "ease-out rounded-none scale-100 visible";
      const closedClass = "ease-in scale-0 opacity-0 rounded-full";

      return `${props.opened ? openedClass : closedClass}`;
    };

    return () => {
      return (
        <div
          class={clsx([
            "transition-opacity transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-80 z-40 duration-700",
            props.absolute ? "absolute" : "fixed",
            `origin-${props.origin}`,
            getOverlayClass()
          ])}
          style={{
            height: "200vmax",
            width: "200vmax"
          }}
        />
      );
    };
  }
});

export { Overlay };
