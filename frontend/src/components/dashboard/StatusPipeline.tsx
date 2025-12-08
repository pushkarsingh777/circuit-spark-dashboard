import { Check, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStep {
  label: string;
  status: "completed" | "in-progress" | "waiting";
  percentage?: number;
}

interface StatusPipelineProps {
  steps: PipelineStep[];
}

export function StatusPipeline({ steps }: StatusPipelineProps) {
  return (
    <div className="flex items-center justify-between bg-card rounded-2xl border border-border p-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center text-center min-w-[80px]">
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-all",
                step.status === "completed" && "bg-success text-success-foreground",
                step.status === "in-progress" && "bg-warning/20 border-2 border-warning text-warning",
                step.status === "waiting" && "bg-muted text-muted-foreground"
              )}
            >
              {step.status === "completed" && <Check className="h-7 w-7" />}
              {step.status === "in-progress" && (
                step.percentage !== undefined ? (
                  <span className="text-sm font-bold">{step.percentage}%</span>
                ) : (
                  <Loader2 className="h-6 w-6 animate-spin" />
                )
              )}
              {step.status === "waiting" && <Clock className="h-6 w-6" />}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                step.status === "completed" && "text-success",
                step.status === "in-progress" && "text-warning",
                step.status === "waiting" && "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            <span
              className={cn(
                "text-[10px] mt-0.5",
                step.status === "completed" && "text-success",
                step.status === "in-progress" && "text-warning",
                step.status === "waiting" && "text-muted-foreground"
              )}
            >
              {step.status === "completed" && "Completed"}
              {step.status === "in-progress" && "In Progress"}
              {step.status === "waiting" && "Waiting"}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-12 mx-2",
                step.status === "completed" ? "bg-success" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
