import { DashboardCard, CardHeader, CardFooter } from "./DashboardCard";
import { StatusBadge } from "./StatusBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface LiveChartProps {
  title: string;
  subtitle?: string;
  data: { time: number; value: number }[];
  color: string;
  gradientId: string;
  status?: "idle" | "running" | "pass" | "fail";
  peakValue?: number;
  powerFactor?: number;
  lastTime?: string;
  unit?: string;
}

export function LiveChart({
  title,
  subtitle,
  data,
  color,
  gradientId,
  status = "idle",
  peakValue,
  powerFactor,
  lastTime,
  unit = "A",
}: LiveChartProps) {
  return (
    <DashboardCard>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{subtitle || title}</p>
          {peakValue !== undefined && (
            <p className="text-3xl font-bold text-foreground mt-1">
              Peak: {peakValue.toFixed(1)} {unit}
            </p>
          )}
        </div>
        {powerFactor !== undefined && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Power Factor</p>
            <p className="text-2xl font-bold text-foreground">{powerFactor.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {(status || lastTime) && (
        <CardFooter>
          {status && <StatusBadge status={status} label={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`} />}
          {lastTime && (
            <span className="text-sm text-muted-foreground">Last: {lastTime}</span>
          )}
        </CardFooter>
      )}
    </DashboardCard>
  );
}
