import type { CSSProperties } from "react";

type FigProps = { className?: string; style?: CSSProperties };

/** Classical profile bust (viewBox 0 0 240 300). Path copied from Aleph.html L16-21. */
export function BustFigure({ className, style }: FigProps) {
  return (
    <svg viewBox="0 0 240 300" className={className} style={style}>
      <path fill="currentColor" d="M70 28 C95 8 150 6 168 34 C178 50 174 64 176 74 C178 80 182 84 190 92
               C200 100 206 108 198 116 C194 120 188 121 184 124 C190 128 192 132 186 138
               C182 142 178 143 180 148 C184 154 180 162 170 168 C162 173 156 176 154 184
               C153 196 158 206 164 214 C172 226 186 230 196 236 L210 252 C214 262 214 270 212 280
               L214 300 L40 300 L40 282 C44 268 52 258 60 248 C66 240 72 232 74 222
               C75 210 72 198 70 186 C60 178 54 168 52 150 C50 120 52 80 58 56 C60 44 64 34 70 28 Z" />
    </svg>
  );
}

/** Plant sprig (viewBox 0 0 120 140). Paths copied from Aleph.html L25-29. */
export function PlantFigure({ className, style }: FigProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style}>
      <path d="M60 140 C60 100 58 70 60 30" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <path fill="currentColor" d="M60 92 C40 86 26 70 24 48 C46 50 58 66 60 88 Z" />
      <path fill="currentColor" d="M60 74 C82 70 96 54 98 34 C76 34 62 50 60 72 Z" />
      <path fill="currentColor" d="M60 50 C46 44 38 30 38 14 C54 18 60 32 60 48 Z" />
      <circle fill="currentColor" cx="60" cy="24" r="9" />
    </svg>
  );
}

/** Abstract winged figure (viewBox 0 0 200 300). Paths copied from Aleph.html L33-37. */
export function WingFigure({ className, style }: FigProps) {
  return (
    <svg viewBox="0 0 200 300" className={className} style={style}>
      <path fill="currentColor" d="M96 40 C108 36 120 44 118 58 C117 66 110 72 100 72 C88 72 82 60 88 50 C90 45 92 42 96 40 Z" />
      <path fill="currentColor" d="M92 76 C110 76 120 92 120 120 C120 150 128 168 140 196 C150 220 152 250 142 280
               L116 300 L80 300 L70 272 C62 244 64 210 70 176 C74 150 72 120 78 98 C82 84 86 78 92 76 Z" />
      <path fill="currentColor" d="M78 110 C44 96 18 96 4 120 C30 132 54 138 80 160 Z" />
      <path fill="currentColor" d="M120 116 C156 100 184 102 198 128 C170 140 146 148 120 168 Z" />
    </svg>
  );
}

export type FigKind = "bust" | "plant" | "wing";

export function Figure({ kind, className, style }: FigProps & { kind: FigKind }) {
  if (kind === "plant") return <PlantFigure className={className} style={style} />;
  if (kind === "wing") return <WingFigure className={className} style={style} />;
  return <BustFigure className={className} style={style} />;
}
