import * as monaco from "@areknawo/monaco-editor";
import { defineComponent, onMounted, ref, watch } from "vue";
import { gray, white } from "tailwindcss/colors";
import { getStore } from "~/src/utils/store";

monaco.editor.defineTheme("dark", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": gray["800"],
    "editor.foreground": white,
    "editor.selectionBackground": gray["700"],
    "editor.lineHighlightBackground": gray["600"],
    "editorCursor.foreground": white
  }
});
monaco.editor.defineTheme("light", {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": gray["100"],
    "editor.foreground": gray["900"],
    "editor.selectionBackground": gray["200"],
    "editor.lineHighlightBackground": gray["50"],
    "editorCursor.foreground": gray["900"]
  }
});

const Editor = defineComponent({
  setup() {
    const editor = ref<HTMLElement | null>(null);
    const insideUpdate = ref(false);
    const outsideUpdate = ref(false);
    const store = getStore();
    const getEditorValue = (): string => {
      return store[store.mode];
    };
    const setEditorValue = (value: string): void => {
      insideUpdate.value = true;
      store[store.mode] = value;
    };
    const getEditorLanguage = (): string => {
      if (store.mode === "js") {
        return store.tsEnabled ? "typescript" : "javascript";
      } else if (store.mode === "css") {
        return store.scssEnabled ? "scss" : "css";
      }

      return "html";
    };

    onMounted(() => {
      if (editor.value) {
        const monacoEditor = monaco.editor.create(editor.value, {
          automaticLayout: true,
          value: getEditorValue(),
          theme: store.theme,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          scrollbar: {
            alwaysConsumeMouseWheel: false
          },
          contextmenu: false,
          language: getEditorLanguage()
        });

        watch(
          () => store.theme,
          (theme) => {
            monaco.editor.setTheme(theme);
          }
        );
        watch([() => store.js, () => store.css, () => store.html], ([js, css, html]) => {
          if (!insideUpdate.value) {
            const updateMap = { js, css, html };

            outsideUpdate.value = true;
            monacoEditor.setValue(updateMap[store.mode]);
          }

          insideUpdate.value = false;
        });
        watch([() => store.mode, () => store.scssEnabled, () => store.tsEnabled], () => {
          const model = monacoEditor.getModel();

          if (model) {
            monaco.editor.setModelLanguage(model, getEditorLanguage());
            monacoEditor.setValue(getEditorValue());
            outsideUpdate.value = false;
            insideUpdate.value = false;
          }
        });
        monacoEditor.onDidChangeModelContent(() => {
          if (!outsideUpdate.value) {
            setEditorValue(monacoEditor.getValue());
          }

          outsideUpdate.value = false;
        });
      }
    });

    return () => (
      <div class="relative h-full w-full from-red-500 to-purple-500">
        <div class="h-full w-full" ref={editor} />
      </div>
    );
  }
});

export { Editor };
