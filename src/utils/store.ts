import { ref, shallowReactive, watch } from "vue";
import { browser } from "webextension-polyfill-ts";

type Color = "red-to-yellow" | "red-to-purple" | "blue-to-purple" | "green-to-blue";
type Theme = "light" | "dark";

interface Store {
  color: Color;
  theme: Theme;
  css: string;
  js: string;
  html: string;
  tsEnabled: boolean;
  scssEnabled: boolean;
  containerWidth: number;
  rightPanelWidth: number;
  rightPanelType: "editor" | "console";
  mode: "js" | "css" | "html";
  x: number;
  y: number;
  height: number;
  width: number;
  direction: string;
  logs: unknown[];
}

let cache: Store | null = null;

const setupWatcher = (): void => {
  const fromMessage = ref(false);

  if (cache) {
    browser.storage.onChanged.addListener((storeUpdate) => {
      fromMessage.value = true;
      Object.assign(
        cache,
        Object.fromEntries(Object.entries(storeUpdate).map(([key, value]) => [key, value.newValue]))
      );
    });
    watch(cache, async (store) => {
      if (!fromMessage.value) {
        await browser.storage.local.set(store);
      }

      fromMessage.value = false;
    });
  }
};
const getDefaults = (): Store => {
  return shallowReactive<Store>({
    color: "red-to-yellow",
    html: "",
    css: "",
    scssEnabled: false,
    theme: "light",
    js: "",
    tsEnabled: false,
    containerWidth: 500,
    rightPanelWidth: 250,
    rightPanelType: "console",
    x: 0,
    y: 0,
    direction: "br",
    height: 400,
    width: 500,
    logs: [],
    mode: "js"
  });
};
const getStore = (): Store => {
  if (!cache) {
    cache = getDefaults();
    browser.storage.local.get().then((store) => {
      Object.assign(cache, store);
    });
  }

  return cache;
};
const loadStore = async (): Promise<Store> => {
  const loaded = await browser.storage.local.get();

  cache = Object.assign(getDefaults(), loaded);
  setupWatcher();

  return cache;
};

export { Color, Store, Theme, getStore, loadStore };
