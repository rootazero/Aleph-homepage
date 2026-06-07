import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source, {
  localeMap: {
    // Chinese is not supported by Orama; fall back to the English tokenizer.
    zh: "english",
  },
});
