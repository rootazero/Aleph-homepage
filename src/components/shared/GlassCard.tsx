import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-aleph-border bg-aleph-surface backdrop-blur-xl p-6",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-aleph-blue/30 hover:shadow-[0_0_30px_rgba(10,132,255,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
