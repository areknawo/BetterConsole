import BabelParser from "prettier/parser-babel";
import HTMLParser from "prettier/parser-html";
import { Plugin } from "prettier";
import PostCSSParser from "prettier/parser-postcss";
import TypeScriptParser from "prettier/parser-typescript";
import { format } from "prettier/standalone";

const getPrettierParserData = (language: string): { parser: string; plugin: Plugin } | null => {
  const languageMap = {
    javascript: ["babel", BabelParser],
    typescript: ["typescript", TypeScriptParser],
    html: ["html", HTMLParser],
    css: ["css", PostCSSParser],
    scss: ["scss", PostCSSParser]
  } as const;
  const prettierParserData = languageMap[language as keyof typeof languageMap];

  if (prettierParserData) {
    return {
      parser: prettierParserData[0],
      plugin: prettierParserData[1]
    };
  }

  return null;
};
const formatCode = (value: string, language: string): string | null => {
  const parserData = getPrettierParserData(language);

  if (parserData) {
    try {
      return format(value, {
        parser: parserData.parser,
        plugins: [parserData.plugin]
      });
    } catch {
      return null;
    }
  }

  return null;
};

export { formatCode };
