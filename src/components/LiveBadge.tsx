import { cn } from '../lib/utils';

export function LiveBadge({
  className,
  label = 'Live',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--live)_40%,transparent)] bg-[color-mix(in_oklab,var(--live)_12%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[color-mix(in_oklab,var(--live)_40%,var(--foreground))]',
        className
      )}
    >
      <span className="live-dot" />
      {label}
    </span>
  );
}
