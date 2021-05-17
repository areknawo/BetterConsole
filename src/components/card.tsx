import { FunctionalComponent, Ref } from "vue";
import clsx from "clsx";

interface CardProps {
  elementRef?: Ref<HTMLElement | null>;
  background?: boolean;
}

const Card: FunctionalComponent<CardProps> = (props, context) => {
  return (
    <div
      class={clsx(
        props.background === false ? "" : "bg-white dark:bg-gray-800",
        "shadow-lg rounded-2xl"
      )}
      ref={props.elementRef}
    >
      {context.slots.default?.()}
    </div>
  );
};

export { Card };
