import { cn } from "@/lib/utils";

type StatusType = "idle" | "running" | "pass" | "fail";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig = {
    idle: {
      color: "bg-muted text-muted-foreground border-muted-foreground/20",
      dot: "bg-muted-foreground",
      text: "Idle",
    },
    running: {
      color: "bg-primary/10 text-primary border-primary/30",
      dot: "bg-primary animate-pulse",
      text: "Running",
    },
    pass: {
      color: "bg-success/10 text-success border-success/30",
      dot: "bg-success",
      text: "Pass",
    },
    fail: {
      color: "bg-destructive/10 text-destructive border-destructive/30",
      dot: "bg-destructive",
      text: "Fail",
    },
  };

  const config = statusConfig[status];

  // ✅ Print to console to ensure connection
  console.log(`StatusBadge Rendered → Status: ${status}, Label: ${label || config.text}`);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border",
        config.color,
        status === "running" && "status-glow"
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      {label || config.text}
    </span>
  );
}
