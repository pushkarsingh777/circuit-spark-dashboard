import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface TestResultBadgeProps {
  result: "pass" | "fail";
  size?: "sm" | "md" | "lg";
}

export function TestResultBadge({ result, size = "md" }: TestResultBadgeProps) {
  const isPass = result === "pass";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase tracking-wide border-2 transition-all",
        sizeClasses[size],
        isPass
          ? "bg-success/15 text-success border-success/40 shadow-sm shadow-success/20"
          : "bg-destructive/15 text-destructive border-destructive/40 shadow-sm shadow-destructive/20"
      )}
    >
      {isPass ? (
        <CheckCircle2 size={iconSizes[size]} className="text-success" />
      ) : (
        <XCircle size={iconSizes[size]} className="text-destructive" />
      )}
      {result}
    </span>
  );
}
