import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TestSettingsCard } from "@/components/dashboard/TestSettingsCard";
import { TestSummaryCard } from "@/components/dashboard/TestSummaryCard";
import { LiveChart } from "@/components/dashboard/LiveChart";
import { TripCurveChart } from "@/components/dashboard/TripCurveChart";
import { OpeningEventChart } from "@/components/dashboard/OpeningEventChart";
import { toast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  type: string;
  result: "pass" | "fail";
  peakCurrent: number;
  timestamp: string;
}

const generateCurrentData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      time: i * 20,
      value: Math.sin(i * 0.3) * 50 + Math.random() * 10 + 100,
    });
  }
  return data;
};

const generateVoltageData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      time: i * 20,
      value: Math.sin(i * 0.3) * 20 + Math.random() * 5 + 230,
    });
  }
  return data;
};

const generateOpeningEventData = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    const t = i * 5;
    data.push({
      time: t,
      voltage: t < 50 ? 230 : Math.max(0, 230 - (t - 50) * 15),
      current: t < 50 ? 150 + Math.random() * 20 : Math.max(0, 150 - (t - 50) * 10),
    });
  }
  return data;
};

const Index = () => {
  const [mcbType, setMcbType] = useState("B");
  const [faultCurrent, setFaultCurrent] = useState("6");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const [currentData, setCurrentData] = useState(generateCurrentData());
  const [voltageData, setVoltageData] = useState(generateVoltageData());
  const [openingData, setOpeningData] = useState(generateOpeningEventData());
  const [peakCurrent, setPeakCurrent] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0);
  const [lastTime, setLastTime] = useState("--");
  const [tripInfo, setTripInfo] = useState("No recent trip");
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [recentTests, setRecentTests] = useState<TestResult[]>([
    { id: "T-001", type: "B", result: "pass", peakCurrent: 145.2, timestamp: "10:23:45" },
    { id: "T-002", type: "C", result: "fail", peakCurrent: 312.8, timestamp: "10:15:22" },
    { id: "T-003", type: "B", result: "pass", peakCurrent: 128.5, timestamp: "10:02:18" },
    { id: "T-004", type: "D", result: "pass", peakCurrent: 456.1, timestamp: "09:48:33" },
  ]);

  const runTest = useCallback(() => {
    setIsRunning(true);
    setStatus("running");
    
    toast({
      title: "Test Started",
      description: `Running MCB Type ${mcbType} test at ${faultCurrent} kA`,
    });

    // Simulate test running
    const interval = setInterval(() => {
      setCurrentData(generateCurrentData());
      setVoltageData(generateVoltageData());
      setPeakCurrent(Math.random() * 200 + 100);
      setPowerFactor(Math.random() * 0.3 + 0.7);
    }, 500);

    // Test completion
    setTimeout(() => {
      clearInterval(interval);
      setIsRunning(false);
      
      const result: "pass" | "fail" = Math.random() > 0.3 ? "pass" : "fail";
      setStatus(result);
      
      const peak = Math.random() * 200 + 100;
      setPeakCurrent(peak);
      setPowerFactor(Math.random() * 0.15 + 0.85);
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      setLastTime(timeStr);
      setTripInfo(`Trip at ${peak.toFixed(1)}A @ ${timeStr}`);
      setOpeningData(generateOpeningEventData());

      const newResult: TestResult = {
        id: `T-${String(recentTests.length + 2).padStart(3, "0")}`,
        type: mcbType,
        result,
        peakCurrent: Math.round(peak * 10) / 10,
        timestamp: timeStr,
      };

      setLatestResult(newResult);
      setRecentTests((prev) => [newResult, ...prev.slice(0, 3)]);

      toast({
        title: result === "pass" ? "✓ Test Passed" : "✗ Test Failed",
        description: `Peak current: ${peak.toFixed(1)} A`,
        variant: result === "pass" ? "default" : "destructive",
      });
    }, 3000);
  }, [mcbType, faultCurrent, recentTests.length]);

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Type", "Result", "Peak Current (A)", "Timestamp"].join(","),
      ...recentTests.map((t) => [t.id, t.type, t.result, t.peakCurrent, t.timestamp].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mcb_test_results.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "CSV file downloaded successfully",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "PDF certificate will be downloaded shortly",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader onExportCSV={handleExportCSV} />

        {/* Settings Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <TestSettingsCard
            mcbType={mcbType}
            faultCurrent={faultCurrent}
            onMcbTypeChange={setMcbType}
            onFaultCurrentChange={setFaultCurrent}
            onRunTest={runTest}
            isRunning={isRunning}
          />
          <TestSummaryCard
            latestResult={latestResult}
            recentTests={recentTests}
            onDownloadReport={handleDownloadReport}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <LiveChart
              title="Live Current"
              subtitle="Live Current"
              data={currentData}
              color="hsl(217, 91%, 60%)"
              gradientId="currentGradient"
              status={status}
              peakValue={peakCurrent}
              powerFactor={powerFactor}
              lastTime={lastTime}
              unit="A"
            />
            <LiveChart
              title="Live Voltage"
              subtitle="Live Voltage"
              data={voltageData}
              color="hsl(38, 92%, 50%)"
              gradientId="voltageGradient"
              unit="V"
            />
          </div>

          <div className="space-y-5">
            <TripCurveChart data={[]} mcbType={mcbType} />
            <OpeningEventChart data={openingData} tripInfo={tripInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
