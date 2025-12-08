import { Check, AlertTriangle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  type: "success" | "warning" | "comment";
  title: string;
  description: string;
  time: string;
  link?: string;
}

interface ActivityLogProps {
  title: string;
  entries: LogEntry[];
  onViewAll?: () => void;
}

export function ActivityLog({ title, entries, onViewAll }: ActivityLogProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="bg-primary text-primary-foreground px-4 py-2">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4 space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="flex gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                entry.type === "success" && "bg-success/10 text-success",
                entry.type === "warning" && "bg-destructive/10 text-destructive",
                entry.type === "comment" && "bg-primary/10 text-primary"
              )}
            >
              {entry.type === "success" && <Check className="h-4 w-4" />}
              {entry.type === "warning" && <AlertTriangle className="h-4 w-4" />}
              {entry.type === "comment" && <MessageCircle className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{entry.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{entry.description}</p>
              {entry.link && (
                <a href="#" className="text-xs text-primary hover:underline mt-1 inline-block">
                  {entry.link}
                </a>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.time}</span>
          </div>
        ))}
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:underline w-full text-left mt-2"
          >
            View all logs
          </button>
        )}
      </div>
    </div>
  );
}
