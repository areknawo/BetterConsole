import { Color, Theme, getStore } from "~/src/utils/store";
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { Button } from "~/src/components/button";
import { FormItem } from "~/src/components/form-item";
import clsx from "clsx";
import { defineComponent } from "vue";

const colors: Color[] = ["red-to-yellow", "red-to-purple", "blue-to-purple", "green-to-blue"];
const Settings = defineComponent({
  setup() {
    const store = getStore();

    return () => {
      return (
        <div class="p-2">
          <div class="text-xl font-semibold">Settings</div>
          <ul>
            {[
              {
                label: "Enable TypeScript",
                getValue() {
                  return store.tsEnabled;
                },
                setValue(value: boolean) {
                  store.tsEnabled = value;
                }
              },
              {
                label: "Enable SCSS",
                getValue() {
                  return store.scssEnabled;
                },
                setValue(value: boolean) {
                  store.scssEnabled = value;
                }
              },
              {
                label: "Theme",
                values: ["light", "dark"] as Theme[],
                getValue() {
                  return store.theme;
                },
                setValue(value: Theme) {
                  store.theme = value;
                }
              }
            ].map(({ label, values, getValue, setValue }) => {
              return (
                <li class="flex items-center py-0.5">
                  <span class="flex-1 pr-2">{label}</span>
                  <FormItem
                    class="capitalize"
                    getValue={getValue}
                    setValue={setValue}
                    possibleValues={values}
                  />
                </li>
              );
            })}
            <li class="flex flex-col items-start py-0.5">
              <span class="flex-1 pr-2">Color</span>
              <div class="flex">
                {colors.map((variant) => (
                  <Button
                    class={clsx("bg-gradient-to-tr text-white", variant)}
                    variant="icon"
                    color="none"
                    iconProps={{
                      path: store.color === variant ? mdiRadioboxMarked : mdiRadioboxBlank
                    }}
                    onClick={() => {
                      store.color = variant;
                    }}
                  />
                ))}
              </div>
            </li>
          </ul>
        </div>
      );
    };
  }
});

export { Settings };
