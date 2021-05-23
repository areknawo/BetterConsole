import { browser } from "webextension-polyfill-ts";
import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBkmu4G2P0MZI1k0Y52cGGWwzrAFUeHTsQ",
  authDomain: "betterconsole.firebaseapp.com",
  projectId: "betterconsole",
  storageBucket: "betterconsole.appspot.com",
  messagingSenderId: "920652406382",
  appId: "1:920652406382:web:9252ce9228cf043194907f",
  measurementId: "G-240MN9BBBS"
});

const db = firebase.firestore();

browser.browserAction.onClicked.addListener(async (tab) => {
  await browser.tabs.executeScript({ file: "/content/index.js" });

  if (tab.id) {
    await browser.tabs.sendMessage(tab.id, "run");
  }
});
browser.contextMenus.create({
  type: "normal",
  title: "Open BetterConsole",
  id: "open-betterconsole"
});
browser.contextMenus.onClicked.addListener(async ({ menuItemId }) => {
  if (menuItemId === "open-betterconsole") {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    await browser.tabs.executeScript({ file: "/content/index.js" });

    if (tab.id) {
      await browser.tabs.sendMessage(tab.id, "run");
    }
  }
});
browser.runtime.onMessage.addListener(
  async ({ username, license }: { username: string; license?: string }) => {
    if (license) {
      const licenseData = (await db.collection("meta").doc("access").get()).data();

      if (!licenseData || licenseData.license === license) {
        await db
          .collection("users")
          .doc(username)
          .set({ blocked: false, lastActive: firebase.firestore.FieldValue.serverTimestamp() });

        return true;
      }

      return false;
    }

    const userData = (await db.collection("users").doc(username).get()).data();

    if (!userData || !userData.blocked) {
      await db
        .collection("users")
        .doc(username)
        .set({ lastActive: firebase.firestore.FieldValue.serverTimestamp() });

      return true;
    }

    return false;
  }
);
