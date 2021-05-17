import { PropType, Ref, defineComponent } from "vue";
import { StyleProps, styleProps } from "~/src/utils/css";

interface InputStyleProps extends StyleProps {
  background: boolean;
  formItem: boolean;
  margin: boolean;
  size: "sm" | "md";
  textarea: boolean;
}

const { getClass, getVueProps } = styleProps<InputStyleProps>([
  "border-none overflow-hidden font-semibold placeholder-gray-400 placeholder-capitalize placeholder-semibold focus:outline-none focus:ring-0 text-gray-500 dark:text-gray-300",
  [
    { formItem: true },
    "py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
  ],
  [{ textarea: true }, "align-bottom"],
  [{ textarea: true, margin: true }, "py-0.5"],
  [{ textarea: false, formItem: false }, "py-0"],
  [{ margin: true }, "px-2"],
  [{ size: "sm" }, "text-sm"],
  [{ background: true, formItem: false }, "bg-gray-300 dark:bg-gray-700 rounded-2xl"],
  [{ background: false, formItem: false }, "bg-transparent"]
]);
const Input = defineComponent({
  props: {
    elementRef: {
      type: Object as PropType<Ref<HTMLInputElement | null> | string>
    },
    type: String,
    value: String,
    valueRef: Object as PropType<Ref<string>>,
    ...getVueProps({
      background: true,
      formItem: false,
      size: "md",
      margin: true,
      textarea: false
    })
  },
  setup(props) {
    const handleInput = ({ target }: Event): void => {
      const { valueRef } = props;

      if (valueRef) {
        valueRef.value = (target as HTMLInputElement).value;
      }
    };

    return () => {
      const Tag = props.textarea ? "textarea" : "input";
      const { elementRef, valueRef } = props;
      const modelProps = {
        onInput: handleInput,
        value: (valueRef || {}).value
      };

      return <Tag {...(valueRef ? modelProps : {})} class={getClass(props)} ref={elementRef} />;
    };
  }
});

export { Input };
