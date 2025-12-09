import { useState, useCallback, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProgressCircle } from "@/components/dashboard/ProgressCircle";
import { StatusPipeline } from "@/components/dashboard/StatusPipeline";
import { HighlightCard } from "@/components/dashboard/HighlightCard";
import { RiskIndicator } from "@/components/dashboard/RiskIndicator";
import { SummarySection } from "@/components/dashboard/SummarySection";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { BarChart } from "@/components/dashboard/BarChart";
import { WorkloadBar } from "@/components/dashboard/WorkloadBar";
import { TestResultBadge } from "@/components/dashboard/TestResultBadge";
import { LiveChart } from "@/components/dashboard/LiveChart";
import { TripCurveChart } from "@/components/dashboard/TripCurveChart";
import { OpeningEventChart } from "@/components/dashboard/OpeningEventChart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Play, Zap, Calendar } from "lucide-react";

interface TestResult {
  id: string;
  type: string;
  result: "pass" | "fail";
  peakCurrent: number;
  timestamp: string;
  duration?: number;
}

const Index = () => {
  const [mcbType, setMcbType] = useState("B");
  const [faultCurrent, setFaultCurrent] = useState("6");
  const [inputPowerFactor, setInputPowerFactor] = useState("0.85");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const [testProgress, setTestProgress] = useState(0);
  const [passRate, setPassRate] = useState(75);
  const [recentTests, setRecentTests] = useState<TestResult[]>([
    { id: "T-001", type: "B", result: "pass", peakCurrent: 145.2, timestamp: "10:23:45", duration: 3.4 },
    { id: "T-002", type: "C", result: "fail", peakCurrent: 312.8, timestamp: "10:15:22", duration: 4.3 },
    { id: "T-003", type: "B", result: "pass", peakCurrent: 128.5, timestamp: "10:02:18", duration: 2.6 },
    { id: "T-004", type: "D", result: "pass", peakCurrent: 456.1, timestamp: "09:48:33", duration: 5.4 },
    { id: "T-005", type: "B", result: "pass", peakCurrent: 135.0, timestamp: "09:30:12", duration: 3.1 },
  ]);

  // Live chart data state
  const [currentData, setCurrentData] = useState<{ time: number; value: number }[]>([]);
  const [openingEventData, setOpeningEventData] = useState<{ time: number; voltage: number; current: number }[]>([]);
  const [tripCurveData, setTripCurveData] = useState<{ current: number; time: number }[]>([]);
  const [peakCurrent, setPeakCurrent] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0.95);
  const [lastUpdateTime, setLastUpdateTime] = useState("--");

  // Generate initial chart data
  useEffect(() => {
    const generateCurrentData = () => Array.from({ length: 50 }, (_, i) => ({
      time: i * 20,
      value: Math.sin(i * 0.3) * 80 + 100 + Math.random() * 20,
    }));

    const generateOpeningData = () => Array.from({ length: 30 }, (_, i) => ({
      time: i * 2,
      voltage: 230 * Math.exp(-i * 0.1) * (1 + Math.random() * 0.1),
      current: 500 * Math.exp(-i * 0.15) * (1 + Math.random() * 0.15),
    }));

    const generateTripData = () => [
      { current: 3, time: 0.5 },
      { current: 5, time: 0.1 },
      { current: 10, time: 0.02 },
    ];

    setCurrentData(generateCurrentData());
    setOpeningEventData(generateOpeningData());
    setTripCurveData(generateTripData());
    setPeakCurrent(145.2);
    setLastUpdateTime(new Date().toLocaleTimeString());
  }, []);

  // Update charts during test
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentData(prev => {
        const newPoint = { time: (prev[prev.length - 1]?.time || 0) + 20, value: Math.sin(Date.now() * 0.005) * 100 + 150 + Math.random() * 30 };
        return [...prev.slice(-49), newPoint];
      });
      setPeakCurrent(prev => Math.max(prev, 100 + Math.random() * 150));
      setPowerFactor(0.85 + Math.random() * 0.1);
      setLastUpdateTime(new Date().toLocaleTimeString());
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning]);

  const getPipelineStatus = (step: string): "completed" | "in-progress" | "waiting" => {
    if (step === "Setup") return status === "idle" ? "waiting" : "completed";
    if (step === "Running") return status === "running" ? "in-progress" : (status === "idle" ? "waiting" : "completed");
    if (step === "Analysis") return status === "running" ? "waiting" : (status === "idle" ? "waiting" : "completed");
    if (step === "Complete") return status === "pass" || status === "fail" ? "completed" : "waiting";
    return "waiting";
  };

  const pipelineSteps = [
    { label: "Setup", status: getPipelineStatus("Setup") },
    { label: "Running", status: getPipelineStatus("Running"), percentage: isRunning ? testProgress : undefined },
    { label: "Analysis", status: getPipelineStatus("Analysis") },
    { label: "Complete", status: getPipelineStatus("Complete") },
  ];

  const getSeverity = (type: string): "high" | "medium" | "low" => {
    if (type === "failRate") return passRate < 80 ? "medium" : "low";
    if (type === "failCount") return recentTests.filter(t => t.result === "fail").length > 1 ? "high" : "medium";
    return "low";
  };

  const riskItems = [
    { value: `${100 - passRate}%`, label: "Test Failure Rate", severity: getSeverity("failRate") },
    { value: recentTests.filter(t => t.result === "fail").length, label: "Failed tests (recent)", severity: getSeverity("failCount") },
    { value: recentTests.length, label: "Total tests today", severity: "low" as const },
  ];

  const testDurationData = recentTests.slice(0, 5).map(t => ({
    name: t.id.replace("T-", ""),
    value: t.duration || 3,
    color: t.result === "pass" ? "hsl(var(--success))" : "hsl(var(--destructive))",
  }));

  const activityLogs = [
    { type: "success" as const, title: "Test T-001 completed", description: "MCB Type B passed at 145.2A", time: "5 min", link: "View report" },
    { type: "warning" as const, title: "Test T-002 failed", description: "MCB Type C exceeded threshold", time: "12 min", link: "View details" },
    { type: "comment" as const, title: "Configuration updated", description: "Fault current changed to 6kA", time: "25 min" },
  ];

  const upcomingTests = [
    { type: "B", description: "Standard load test", deadline: "Today", workload: 14 },
    { type: "C", description: "High inrush test", deadline: "Tomorrow", workload: 50 },
    { type: "D", description: "Motor starting test", deadline: "Dec 10", workload: 30 },
  ];

  const runTest = useCallback(() => {
    setIsRunning(true);
    setStatus("running");
    setTestProgress(0);
    
    toast({ title: "Test Started", description: `Running MCB Type ${mcbType} test at ${faultCurrent} kA, PF: ${inputPowerFactor}` });

    const progressInterval = setInterval(() => {
      setTestProgress(prev => Math.min(prev + 15, 95));
    }, 400);

    setTimeout(() => {
      clearInterval(progressInterval);
      setTestProgress(100);
      setIsRunning(false);
      
      const result: "pass" | "fail" = Math.random() > 0.3 ? "pass" : "fail";
      setStatus(result);
      
      const peak = Math.random() * 200 + 100;
      const duration = Math.random() * 3 + 2;
      const timeStr = new Date().toLocaleTimeString();

      const newResult: TestResult = {
        id: `T-${String(recentTests.length + 2).padStart(3, "0")}`,
        type: mcbType,
        result,
        peakCurrent: Math.round(peak * 10) / 10,
        timestamp: timeStr,
        duration: Math.round(duration * 10) / 10,
      };

      setRecentTests((prev) => [newResult, ...prev.slice(0, 4)]);
      const passed = recentTests.filter(t => t.result === "pass").length + (result === "pass" ? 1 : 0);
      setPassRate(Math.round((passed / (recentTests.length + 1)) * 100));

      toast({
        title: result === "pass" ? "✓ Test Passed" : "✗ Test Failed",
        description: `Peak current: ${peak.toFixed(1)} A`,
        variant: result === "pass" ? "default" : "destructive",
      });
    }, 3000);
  }, [mcbType, faultCurrent, recentTests]);

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Type", "Result", "Peak Current (A)", "Timestamp", "Duration (s)"].join(","),
      ...recentTests.map((t) => [t.id, t.type, t.result, t.peakCurrent, t.timestamp, t.duration].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mcb_test_results.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export Complete", description: "CSV file downloaded successfully" });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader onExportCSV={handleExportCSV} />
        <p className="text-sm text-muted-foreground mb-6">Track key performance indicators of MCB testing including pass/fail rates, test duration, and upcoming tests.</p>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-3">Overall Progress</p>
            <ProgressCircle value={passRate} size={100} />
          </div>
          <div className="lg:col-span-7"><StatusPipeline steps={pipelineSteps} /></div>
          <div className="lg:col-span-3">
            <HighlightCard title="Next Scheduled Test" value="Today" subtitle={`MCB Type ${mcbType}`} variant="success" icon={<Calendar className="h-8 w-8" />} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          <RiskIndicator title="Risk Analysis" items={riskItems} />
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Test Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">MCB Type</label>
                <Select value={mcbType} onValueChange={setMcbType}>
                  <SelectTrigger className="h-10 bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B">Type B</SelectItem>
                    <SelectItem value="C">Type C</SelectItem>
                    <SelectItem value="D">Type D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Fault Current</label>
                <Select value={faultCurrent} onValueChange={setFaultCurrent}>
                  <SelectTrigger className="h-10 bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 kA</SelectItem>
                    <SelectItem value="10">10 kA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Power Factor</label>
                <Select value={inputPowerFactor} onValueChange={setInputPowerFactor}>
                  <SelectTrigger className="h-10 bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.80">0.80</SelectItem>
                    <SelectItem value="0.85">0.85</SelectItem>
                    <SelectItem value="0.90">0.90</SelectItem>
                    <SelectItem value="0.95">0.95</SelectItem>
                    <SelectItem value="1.00">1.00 (Unity)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="success" className="w-full" onClick={runTest} disabled={isRunning}>
                {isRunning ? <><Zap className="animate-pulse" /> Running...</> : <><Play /> Run Test</>}
              </Button>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-destructive text-destructive-foreground px-4 py-2"><h3 className="text-sm font-semibold">Failed Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">ID</th><th className="px-3 py-2 text-left text-muted-foreground">Type</th><th className="px-3 py-2 text-right text-muted-foreground">Peak</th></tr></thead>
              <tbody>{recentTests.filter(t => t.result === "fail").map(t => <tr key={t.id} className="border-b border-border/50"><td className="px-3 py-2">{t.id}</td><td className="px-3 py-2">{t.type}</td><td className="px-3 py-2 text-right">{t.peakCurrent}A</td></tr>)}</tbody>
            </table>
          </div>
          <ActivityLog title="Test Log" entries={activityLogs} />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          <SummarySection title="Test Summary" items={[{ label: "Date", value: new Date().toLocaleDateString() }, { label: "MCB Type", value: `Type ${mcbType}` }, { label: "Fault Current", value: `${faultCurrent} kA` }, { label: "Status", value: status === "idle" ? "Ready" : status.charAt(0).toUpperCase() + status.slice(1) }]} highlightLast />
          <BarChart title="Test Duration (seconds)" data={testDurationData} />
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-success text-success-foreground px-4 py-2"><h3 className="text-sm font-semibold">Recent Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">ID</th><th className="px-3 py-2 text-left text-muted-foreground">Result</th><th className="px-3 py-2 text-right text-muted-foreground">Peak</th></tr></thead>
              <tbody>{recentTests.slice(0, 4).map(t => <tr key={t.id} className={t.result === "pass" ? "bg-success/5" : "bg-destructive/5"}><td className="px-3 py-2">{t.id}</td><td className="px-3 py-2"><TestResultBadge result={t.result} size="sm" /></td><td className="px-3 py-2 text-right font-mono">{t.peakCurrent}A</td></tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-warning text-warning-foreground px-4 py-2"><h3 className="text-sm font-semibold">Upcoming Tests</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-left text-muted-foreground">Type</th><th className="px-3 py-2 text-left text-muted-foreground">Date</th><th className="px-3 py-2 text-left text-muted-foreground">Priority</th></tr></thead>
              <tbody>{upcomingTests.map((t, i) => <tr key={i} className="border-b border-border/50"><td className="px-3 py-2">{t.type}</td><td className="px-3 py-2">{t.deadline}</td><td className="px-3 py-2"><WorkloadBar value={t.workload} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        {/* Fourth Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LiveChart
            title="Live Current"
            subtitle="Real-time current measurement"
            data={currentData}
            color="hsl(var(--primary))"
            gradientId="currentGradient"
            status={status}
            peakValue={peakCurrent}
            powerFactor={powerFactor}
            lastTime={lastUpdateTime}
            unit="A"
          />
          <TripCurveChart data={tripCurveData} mcbType={mcbType} />
          <OpeningEventChart data={openingEventData} tripInfo={`Last trip: ${lastUpdateTime}`} />
        </div>
      </div>
    </div>
  );
};

export default Index;
