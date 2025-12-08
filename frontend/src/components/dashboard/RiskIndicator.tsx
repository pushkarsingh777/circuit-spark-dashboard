import { AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskItem {
  value: string | number;
  label: string;
  severity: "high" | "medium" | "low";
}

interface RiskIndicatorProps {
  title: string;
  items: RiskItem[];
}

export function RiskIndicator({ title, items }: RiskIndicatorProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span
              className={cn(
                "text-lg font-bold min-w-[50px]",
                item.severity === "high" && "text-destructive",
                item.severity === "medium" && "text-warning",
                item.severity === "low" && "text-success"
              )}
            >
              {item.value}
            </span>
            <div className="flex items-center gap-2 text-sm">
              {item.severity === "high" && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              {item.severity === "medium" && (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
              <span
                className={cn(
                  item.severity === "high" && "text-destructive",
                  item.severity === "medium" && "text-warning",
                  item.severity === "low" && "text-success"
                )}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
