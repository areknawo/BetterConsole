import { FunctionalComponent } from "vue";
import clsx from "clsx";

interface CheckboxProps {
  value: boolean;
  size?: "sm" | "md";
  setValue(value: boolean): void;
}

const Checkbox: FunctionalComponent<CheckboxProps> = (props) => {
  return (
    <input
      type="checkbox"
      class={clsx(
        "border-2 bg-transparent border-gray-200 dark:checked:border-transparent focus:ring-0 focus:ring-offset-0 checked:border-transparent dark:border-gray-700 no-shadow rounded-lg gradient-checkbox",
        props.size === "sm" ? "h-5 w-5" : "h-6 w-6"
      )}
      checked={props.value}
      onChange={({ target }) => props.setValue((target as HTMLInputElement).checked)}
    />
  );
};

export { Checkbox };
