import type { FigKind } from "./figures";

export type Tone = "coral" | "mustard" | "sage" | "ink";

export const CAP_IDS = ["research", "inbox", "schedule", "life", "write", "code"] as const;
export type CapId = (typeof CAP_IDS)[number];

/** Which preview renderer each capability uses. */
export const CAP_KIND: Record<CapId, "chat" | "steps" | "cal"> = {
  research: "chat",
  inbox: "steps",
  schedule: "cal",
  life: "steps",
  write: "chat",
  code: "steps",
};

export const GALLERY: { id: string; fig: FigKind; tone: Tone; anim: string }[] = [
  { id: "0", fig: "bust", tone: "coral", anim: "up" },
  { id: "1", fig: "plant", tone: "mustard", anim: "scale" },
  { id: "2", fig: "wing", tone: "ink", anim: "rot" },
  { id: "3", fig: "bust", tone: "sage", anim: "up" },
  { id: "4", fig: "plant", tone: "coral", anim: "scale" },
];

export const PROCESS: { id: string; num: string; fig: FigKind }[] = [
  { id: "0", num: "01", fig: "bust" },
  { id: "1", num: "02", fig: "plant" },
  { id: "2", num: "03", fig: "wing" },
  { id: "3", num: "04", fig: "bust" },
];

export const AGENTS: { id: string; tone: Tone }[] = [
  { id: "0", tone: "coral" },
  { id: "1", tone: "mustard" },
  { id: "2", tone: "sage" },
  { id: "3", tone: "coral" },
];

export const OS_ICON: Record<"mac" | "windows" | "linux", string> = {
  mac: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.3 12.55c-.02-2.55 2.08-3.77 2.18-3.83-1.19-1.74-3.04-1.98-3.7-2-1.57-.16-3.07.92-3.87.92-.8 0-2.03-.9-3.34-.88-1.72.03-3.3 1-4.18 2.53-1.78 3.1-.46 7.68 1.28 10.2.85 1.23 1.86 2.6 3.18 2.55 1.28-.05 1.76-.82 3.3-.82 1.54 0 1.98.82 3.34.8 1.38-.03 2.25-1.25 3.1-2.49.98-1.43 1.38-2.81 1.4-2.88-.03-.01-2.69-1.03-2.71-4.1zM13.9 5.3c.7-.86 1.18-2.04 1.05-3.22-1.01.04-2.24.68-2.97 1.53-.65.76-1.23 1.98-1.07 3.14 1.13.09 2.28-.58 2.99-1.45z"/></svg>',
  windows: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.55l7.6-1.04v7.33H3V5.55zm8.49-1.16L21.5 3v9.5h-10.01V4.39zM3 12.74h7.6v7.34L3 19.04v-6.3zm8.49 0H21.5V21l-10.01-1.38v-6.88z"/></svg>',
  linux: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-1.96 0-3.05 1.66-3.05 3.94 0 .94.18 1.62-.5 2.55C7.1 10.2 6.1 11.96 6.1 14c0 1.32-.92 2.2-1.5 3.06-.5.74.04 1.55.93 1.36.55 1.02 1.5 1.92 2.83 2.4-.2.28-.05.5.3.5h6.62c.35 0 .5-.22.3-.5 1.33-.48 2.28-1.38 2.83-2.4.89.19 1.43-.62.93-1.36-.58-.86-1.5-1.74-1.5-3.06 0-2.04-1-3.8-2.35-5.51-.68-.93-.5-1.61-.5-2.55C15.05 3.66 13.96 2 12 2zm-1.42 4.05c.42 0 .76.42.76.95 0 .52-.34.94-.76.94-.42 0-.76-.42-.76-.94 0-.53.34-.95.76-.95zm2.84 0c.42 0 .76.42.76.95 0 .52-.34.94-.76.94-.42 0-.76-.42-.76-.94 0-.53.34-.95.76-.95zM12 9.1c.74 0 1.7.5 1.7 1.03 0 .32-.66.62-1.7.62s-1.7-.3-1.7-.62c0-.53.96-1.03 1.7-1.03z"/></svg>',
};

/** tone -> CSS var for coral-disc backgrounds */
export const TONE_VAR: Record<Tone, string> = {
  coral: "var(--coral)",
  mustard: "var(--mustard)",
  sage: "var(--sage)",
  ink: "var(--ink)",
};
