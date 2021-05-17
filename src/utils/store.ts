import { browser } from "webextension-polyfill-ts";

type Color = "red-to-yellow" | "red-to-purple" | "blue-to-purple" | "green-to-blue";
type Theme = "auto" | "light" | "dark";

interface Storage {
  color: Color;
  theme: Theme;
  scss: string;
  ts: string;
  html: string;
  tsEnabled: boolean;
  scssEnabled: boolean;
}

const defaults: Storage = {
  color: "red-to-yellow",
  html: "",
  scss: "",
  scssEnabled: false,
  theme: "light",
  ts: "",
  tsEnabled: false
};
const getStorage = async (): Promise<Storage> => {
  const storage = await browser.storage.local.get();

  return { ...defaults, ...storage };
};
const storeGet = () => {};
const storeSet = () => {};

export { Color, Storage, Theme, getStorage };
