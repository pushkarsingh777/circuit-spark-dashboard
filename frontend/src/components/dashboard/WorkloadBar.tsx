import { cn } from "@/lib/utils";

interface WorkloadBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function WorkloadBar({ value, max = 100, className }: WorkloadBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            percentage < 30 && "bg-success",
            percentage >= 30 && percentage < 70 && "bg-warning",
            percentage >= 70 && "bg-destructive"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground min-w-[32px]">
        {value}%
      </span>
    </div>
  );
}
