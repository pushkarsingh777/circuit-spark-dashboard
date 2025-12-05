import { DashboardCard, CardHeader } from "./DashboardCard";
import { Button } from "@/components/ui/button";
import { TestResultBadge } from "./TestResultBadge";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResult {
  id: string;
  type: string;
  result: "pass" | "fail";
  peakCurrent: number;
  timestamp: string;
}

interface TestSummaryCardProps {
  latestResult: TestResult | null;
  recentTests: TestResult[];
  onDownloadReport: () => void;
}

export function TestSummaryCard({
  latestResult,
  recentTests,
  onDownloadReport,
}: TestSummaryCardProps) {
  return (
    <DashboardCard>
      <CardHeader title="Latest Test Summary" />

      {latestResult ? (
        <div
          className={cn(
            "p-4 rounded-xl border-l-4 mb-4",
            latestResult.result === "pass"
              ? "bg-success/5 border-success"
              : "bg-destructive/5 border-destructive"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Test #{latestResult.id}
            </span>
            <TestResultBadge result={latestResult.result} size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">MCB Type:</span>
              <span className="ml-2 font-semibold">{latestResult.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Peak Current:</span>
              <span className="ml-2 font-semibold">{latestResult.peakCurrent} A</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-muted/50 text-muted-foreground text-sm mb-4">
          <FileText className="inline-block mr-2 h-4 w-4" />
          No test executed yet. Configure settings and run a test.
        </div>
      )}

      <Button
        variant="destructive"
        className="w-full mb-5"
        onClick={onDownloadReport}
        disabled={!latestResult}
      >
        <Download />
        Download Certificate (PDF)
      </Button>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Tests</h4>
        <div className="overflow-hidden rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Result</th>
                <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Peak (A)</th>
              </tr>
            </thead>
            <tbody>
              {recentTests.length > 0 ? (
                recentTests.map((test, index) => (
                  <tr
                    key={test.id}
                    className={cn(
                      "border-t border-border/30 transition-colors",
                      test.result === "pass"
                        ? "bg-success/5 hover:bg-success/10"
                        : "bg-destructive/5 hover:bg-destructive/10"
                    )}
                  >
                    <td className="px-3 py-2.5 font-medium">{test.id}</td>
                    <td className="px-3 py-2.5">{test.type}</td>
                    <td className="px-3 py-2.5">
                      <TestResultBadge result={test.result} size="sm" />
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono">{test.peakCurrent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">
                    No recent tests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardCard>
  );
}
