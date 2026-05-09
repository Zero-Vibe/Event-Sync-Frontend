import { cn } from "../lib/utils";

export function LiveBadge({ className, label = "Live now" }: { className?: string; label?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--live)_45%,transparent)] bg-[color-mix(in_oklab,var(--live)_18%,transparent)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[color-mix(in_oklab,var(--live)_30%,var(--foreground))]",
      className
    )}>
      <span className="live-dot" />
      {label}
    </span>
  );
}