"use client";

import { useState } from "react";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-xl bg-[#0d1117] border border-aleph-border overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-aleph-border">
        <span className="text-xs text-aleph-muted font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-aleph-muted hover:text-white transition-colors"
        >
          {copied ? "\u2713" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-aleph-cyan">{code}</code>
      </pre>
    </div>
  );
}
