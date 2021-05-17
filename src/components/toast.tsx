import { FunctionalComponent, Ref } from "vue";
import { mdiAlert, mdiInformation, mdiPartyPopper } from "@mdi/js";
import { Icon } from "~/src/components/icon";
import clsx from "clsx";

type ToastType = "info" | "error" | "success";

interface ToastProps {
  elementRef?: Ref<HTMLElement | null>;
  fixed?: boolean;
  type?: ToastType;
  text: string;
  interactive: boolean;
}

const getToastIcon = (type?: ToastType): string => {
  switch (type) {
    case "error":
      return mdiAlert;
    case "success":
      return mdiPartyPopper;
    case "info":
    default:
      return mdiInformation;
  }
};
const Toast: FunctionalComponent<ToastProps> = (props) => {
  const fixed = typeof props.fixed === "boolean" ? props.fixed : true;

  return (
    <div
      class={clsx(
        "bg-gradient-to-tr text-white shadow-lg rounded-full font-semibold text-xl flex justify-center items-center pl-1 pr-2 py-1 my-1",
        props.interactive && "transition transform hover:scale-105 cursor-pointer",
        fixed && "fixed bottom-4 left-4"
      )}
      ref={props.elementRef}
    >
      <Icon size="lg" path={getToastIcon(props.type)} />
      <span class="ml-2">{props.text}</span>
    </div>
  );
};

export { Toast };
