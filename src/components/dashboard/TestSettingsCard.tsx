import { DashboardCard, CardHeader } from "./DashboardCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Zap } from "lucide-react";

interface TestSettingsCardProps {
  mcbType: string;
  faultCurrent: string;
  onMcbTypeChange: (value: string) => void;
  onFaultCurrentChange: (value: string) => void;
  onRunTest: () => void;
  isRunning: boolean;
}

export function TestSettingsCard({
  mcbType,
  faultCurrent,
  onMcbTypeChange,
  onFaultCurrentChange,
  onRunTest,
  isRunning,
}: TestSettingsCardProps) {
  // ✅ Console log to ensure connection
  console.log("TestSettingsCard Rendered →", { mcbType, faultCurrent, isRunning });

  return (
    <DashboardCard>
      <CardHeader title="Test Settings" subtitle="Configure MCB parameters" />
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            MCB Type
          </label>
          <Select value={mcbType} onValueChange={onMcbTypeChange}>
            <SelectTrigger className="w-full h-12 bg-muted/50 border-border/50 rounded-xl">
              <SelectValue placeholder="Select MCB Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="B">Type B - General Purpose</SelectItem>
              <SelectItem value="C">Type C - Motor Starting</SelectItem>
              <SelectItem value="D">Type D - High Inrush</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Fault Current (kA)
          </label>
          <Select value={faultCurrent} onValueChange={onFaultCurrentChange}>
            <SelectTrigger className="w-full h-12 bg-muted/50 border-border/50 rounded-xl">
              <SelectValue placeholder="Select Fault Current" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 kA</SelectItem>
              <SelectItem value="10">10 kA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="success"
          size="lg"
          className="w-full mt-4"
          onClick={onRunTest}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Zap className="animate-pulse" />
              Running Test...
            </>
          ) : (
            <>
              <Play />
              Run Test
            </>
          )}
        </Button>
      </div>
    </DashboardCard>
  );
}
