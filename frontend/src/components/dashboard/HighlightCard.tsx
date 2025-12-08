import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HighlightCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "success" | "warning" | "destructive" | "primary";
  icon?: ReactNode;
  className?: string;
}

export function HighlightCard({
  title,
  value,
  subtitle,
  variant = "success",
  icon,
  className,
}: HighlightCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 text-white",
        variant === "success" && "bg-gradient-to-br from-success to-success/80",
        variant === "warning" && "bg-gradient-to-br from-warning to-warning/80",
        variant === "destructive" && "bg-gradient-to-br from-destructive to-destructive/80",
        variant === "primary" && "bg-gradient-to-br from-primary to-primary/80",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-90 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-lg font-semibold mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
    </div>
  );
}
