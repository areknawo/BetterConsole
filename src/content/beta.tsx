import { computed, defineComponent, inject, nextTick, ref, watch } from "vue";
import { Button } from "~/src/components/button";
import { Dialog } from "~/src/components/dialog";
import { Input } from "~/src/components/input";
import { Tooltip } from "~/src/components/tooltip";
import { browser } from "webextension-polyfill-ts";
import { getStore } from "~/src/utils/store";
import { mdiChevronRight } from "@mdi/js";

const BetaDialog = defineComponent({
  setup() {
    const store = getStore();
    const username = ref(store.username);
    const license = ref(store.license);
    const canContinue = computed(() => username.value && license.value);
    const opened = ref(!store.username || !store.license);
    const error = ref("");
    const reload = inject<() => Promise<void>>("reload");
    const checkContinue = async (): Promise<void> => {
      const allowed = await browser.runtime.sendMessage({
        username: username.value,
        license: license.value
      });

      if (allowed) {
        store.username = username.value;
        store.license = license.value;
        await nextTick(async () => {
          if (reload) {
            await reload();
          }
        });
      } else {
        error.value = "Wrong license";
      }
    };

    watch([username, license], () => {
      error.value = "";
    });

    return () => {
      return (
        <Dialog
          class="w-full h-full top-0 absolute overflow-hidden"
          opened={opened}
          origin="center"
          absolute
        >
          <div class="p-2 flex flex-col justify-center items-center text-gray-900 dark:text-white">
            <div class="flex w-full items-center mb-2">
              <h1 class="text-xl font-semibold flex-1">Beta access</h1>
              <Tooltip text="Continue" side="left">
                <Button
                  color="gradient"
                  variant="icon"
                  margin={false}
                  iconProps={{ path: mdiChevronRight }}
                  onClick={checkContinue}
                  disabled={!canContinue.value}
                />
              </Tooltip>
            </div>
            <Input placeholder="Username" formItem class="mb-2" valueRef={username} />
            <Input placeholder="License" formItem valueRef={license} />
            {error.value && <span class="text-sm">{error.value}</span>}
          </div>
        </Dialog>
      );
    };
  }
});

export { BetaDialog };
