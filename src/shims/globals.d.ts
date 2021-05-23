import { Component, ComponentOptionsBase, DefineComponent } from "vue";

declare global {
  interface CustomRef<V> {
    value: null | V;
  }
  interface Window {
    isBetterConsoleLoaded: boolean;
  }
  interface BeforeInstallPromptEvent extends Event {
    /**
     * Returns an array of DOMString items containing the platforms on which the event was dispatched.
     * This is provided for user agents that want to present a choice of versions to the user such as,
     * for example, "web" or "play" which would allow the user to chose between a web version or
     * an Android version.
     */
    readonly platforms: Array<string>;

    /**
     * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
     */
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;

    /**
     * Allows a developer to show the install prompt at a time of their own choosing.
     * This method returns a Promise.
     */
    prompt(): Promise<void>;
  }

  type A = any;
  type GenericDefineComponent = DefineComponent<A, A, A, A, A, A, A, A, A, A, A, A>;
  type ComponentProps<C extends Component<any, any>> = C extends ComponentOptionsBase<
    infer P,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    infer Defaults
  >
    ? Partial<Defaults> & Omit<P, keyof Defaults>
    : {};
  type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
  } extends { [_ in keyof T]: infer U }
    ? U
    : never;
  type RequiredOnly<T extends Record<string, unknown>> = Pick<T, KnownKeys<T>>;
}
