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
        "rounded-2xl border border-edge bg-surface backdrop-blur-xl p-6",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_0_30px_var(--glow)]",
        className
      )}
    >
      {children}
    </div>
  );
}
