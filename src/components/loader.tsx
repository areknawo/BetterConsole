import { FunctionalComponent } from "vue";
import { Logo } from "~/src/components/logo";
import { Overlay } from "~/src/components/overlay";
import clsx from "clsx";

interface LoaderProps {
  active: boolean;
  noDelay?: boolean;
  noHideScroll?: boolean;
  message?: string | JSX.Element;
  subMessage?: string | JSX.Element;
  size?: "sm" | "md";
}

const Loader: FunctionalComponent<LoaderProps> = (props) => {
  const getLoaderClass = (): string => {
    const openedClass = "ease-out scale-100 visible z-20";
    const closedClass = "ease-in scale-0 opacity-0 z-0";

    return `${props.active ? openedClass : closedClass}`;
  };

  if (!props.noHideScroll) {
    if (props.active) {
      document.body.classList.add("dialog");
    } else {
      document.body.classList.remove("dialog");
    }
  }

  return (
    <div
      class={clsx(
        "flex flex-col justify-center items-center fixed w-full h-full top-0 left-0",
        "transition-all transform duration-500",
        !props.noDelay && "delay-200",
        getLoaderClass()
      )}
    >
      <Overlay opened={props.active} class={!props.noDelay && "delay-200"} />
      <Logo
        class={clsx("z-50", props.size === "sm" ? "h-16 w-16" : "h-32 w-32")}
        color="light"
        animated
      />
      {props.message && (
        <span
          class={clsx(
            "text-gray-300 z-50 font-bold max-w-sm text-center",
            props.size === "md" && "text-lg"
          )}
        >
          {props.message}
        </span>
      )}
      {props.subMessage && (
        <span
          class={clsx("text-gray-300 z-50 max-w-sm text-center", props.size === "sm" && "text-sm")}
        >
          ({props.subMessage})
        </span>
      )}
    </div>
  );
};

export { Loader };
