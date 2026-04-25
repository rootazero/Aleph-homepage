"use client";

import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "bash",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative group overflow-hidden", className)}>
      <pre className="p-8 overflow-x-auto no-scrollbar">
        <code className="text-sm md:text-base font-mono text-cyan-400 leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}
