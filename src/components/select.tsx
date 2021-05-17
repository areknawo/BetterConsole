import { FunctionalComponent } from "vue";
import clsx from "clsx";

interface SelectProps {
  options: Array<{ value: string; label: string } | string>;
  value: string;
  size?: "sm" | "md";
  setValue(value: string): void;
}

const Select: FunctionalComponent<SelectProps> = (props) => {
  return (
    <select
      class={clsx(
        "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 focus:ring-0 border-none no-shadow pl-2 pr-8 py-0 rounded-lg font-semibold",
        props.size === "sm" ? "h-7 text-sm" : "h-8"
      )}
      onChange={({ target }) => props.setValue((target as HTMLSelectElement).value)}
      value={props.value}
    >
      {props.options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;

        return <option value={value}>{label}</option>;
      })}
    </select>
  );
};

export { Select };
