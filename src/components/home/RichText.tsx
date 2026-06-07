import type { CSSProperties } from "react";

type RichTextProps = {
  html: string;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
};

/** Renders trusted, in-repo HTML strings (e.g. `<span class="serif-it coral">`). */
export function RichText({ html, className, style, as: Tag = "span" }: RichTextProps) {
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
