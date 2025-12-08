import { useEffect } from "react";
import { DashboardCard } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface OpeningEventChartProps {
  data: { time: number; voltage: number; current: number }[];
  tripInfo: string;
}

export function OpeningEventChart({ data, tripInfo }: OpeningEventChartProps) {

  // 🔥 Backend Connectivity Check
  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((res) => res.json())
      .then((data) => {
        console.log("OpeningEventChart Connected to Flask:", data.message);
      })
      .catch((error) => {
        console.error("OpeningEventChart Failed to Connect:", error);
      });
  }, []);

  return (
    <DashboardCard>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Opening Event</p>
          <p className="text-xs text-muted-foreground mt-1">Voltage & Current</p>
        </div>
        <p className="text-sm text-muted-foreground text-right">{tripInfo}</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: "Time (ms)", position: "bottom", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="voltage"
              name="Voltage (V)"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Current (A)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
