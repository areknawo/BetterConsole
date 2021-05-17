import { defineComponent, ref } from "vue";
import {
  mdiCodeTagsCheck,
  mdiCogOutline,
  mdiCursorDefaultOutline,
  mdiPlayCircleOutline,
  mdiRefresh
} from "@mdi/js";
import { Button } from "~/src/components/button";
import { Dialog } from "~/src/components/dialog";
import { Select } from "~/src/components/select";
import { Tooltip } from "~/src/components/tooltip";
import clsx from "clsx";

const Menu = defineComponent({
  setup() {
    const isOpened = ref(false);

    return () => {
      return (
        <>
          <div class="absolute top-2 right-2 flex flex-col justify-center items-end z-50 opacity-50 hover:opacity-100">
            <Select
              class="mt-1"
              options={["HTML", "JavaScript", "CSS"]}
              value={"CSS"}
              setValue={() => {}}
            />
          </div>
          <div class="z-full w-full rounded-2xl absolute bottom-2 flex justify-center items-center opacity-50 hover:opacity-100">
            <div class="bg-gray-200 dark:bg-gray-700 max-w-sm rounded-2xl flex justify-center items-center mx-2">
              {[
                { icon: mdiCogOutline, label: "Settings" },
                { icon: mdiRefresh, label: "Clear" },
                { icon: mdiPlayCircleOutline, label: "Run", gradient: true },
                { icon: mdiCursorDefaultOutline, label: "Select element" },
                { icon: mdiCodeTagsCheck, label: "Format" }
              ].map(({ gradient, icon, label }) => {
                return (
                  <Tooltip text={label} side="top">
                    <Button
                      variant="icon"
                      size="lg"
                      iconProps={{ path: icon }}
                      color={gradient ? "gradient" : "grayish"}
                      onClick={() => {
                        isOpened.value = true;
                      }}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
          <div
            class={clsx(
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z- max-w-full max-h-full rounded-2xl overflow-hidden z-10 w-full h-full overflow-hidden",
              isOpened.value ? "" : "pointer-events-none"
            )}
          >
            <Dialog opened={isOpened} origin="center" class="h-full w-full">
              <div class="p-2 text-gray-900 dark:text-white">Saves</div>
              <ul>
                {["Math loop"].map((label) => {
                  return <li>{label}</li>;
                })}
              </ul>
            </Dialog>
          </div>
        </>
      );
    };
  }
});

export { Menu };
