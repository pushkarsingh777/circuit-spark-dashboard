import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";

interface DashboardHeaderProps {
  onExportCSV: () => void;
}

export function DashboardHeader({ onExportCSV }: DashboardHeaderProps) {
  return (
    <header className="glass-card rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">MCB Test Dashboard</h1>
          <p className="text-sm text-muted-foreground">Miniature Circuit Breaker Testing System</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground">Connected to Backend</span>
        <Button variant="warning" onClick={onExportCSV}>
          <Download />
          Export CSV
        </Button>
      </div>
    </header>
  );
}
