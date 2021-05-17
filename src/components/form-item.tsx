import { Checkbox } from "~/src/components/checkbox";
import { FunctionalComponent } from "vue";
import { Input } from "~/src/components/input";
import { Select } from "~/src/components/select";

type SettingValue = string | number | boolean;

interface FormItem<T extends SettingValue = SettingValue> {
  formItemProps?:
    | Partial<ComponentProps<typeof Select>>
    | Partial<ComponentProps<typeof Input>>
    | Partial<ComponentProps<typeof Checkbox>>;
  class?: string;
  possibleValues?: T[];
  getValue(): T;
  setValue(value: T): void;
}

const FormItem: FunctionalComponent<FormItem> = (menuItem) => {
  const value = menuItem.getValue();

  if (typeof value === "string") {
    if (menuItem.possibleValues) {
      return (
        <Select
          class={menuItem.class}
          options={(menuItem.possibleValues as string[]) || []}
          setValue={menuItem.setValue}
          size="sm"
          value={value}
          {...menuItem.formItemProps}
        />
      );
    }

    return (
      <Input
        class={menuItem.class}
        value={value}
        formItem
        onInput={({ target }) => {
          menuItem.setValue((target as HTMLInputElement).value);
        }}
        size="sm"
        {...menuItem.formItemProps}
      />
    );
  } else if (typeof value === "boolean") {
    return (
      <Checkbox
        class={menuItem.class}
        value={value}
        setValue={menuItem.setValue}
        size="sm"
        {...menuItem.formItemProps}
      />
    );
  }

  return (
    <Input
      class={menuItem.class}
      formItem
      type="number"
      value={value}
      onInput={({ target }) => {
        menuItem.setValue(Number((target as HTMLInputElement).value));
      }}
      size="sm"
      min={(menuItem.possibleValues || [])[0]}
      max={(menuItem.possibleValues || [])[1]}
      {...menuItem.formItemProps}
    />
  );
};

export { FormItem };
