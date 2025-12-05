import { DashboardCard, CardHeader } from "./DashboardCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface TripCurveChartProps {
  data: { current: number; time: number }[];
  mcbType: string;
}

export function TripCurveChart({ data, mcbType }: TripCurveChartProps) {
  // Generate characteristic curve based on MCB type
  const generateCurve = () => {
    const points = [];
    for (let i = 1; i <= 20; i++) {
      const current = i;
      let time: number;
      
      switch (mcbType) {
        case "B":
          time = current < 3 ? 100 / current : current < 5 ? 10 / current : 0.1;
          break;
        case "C":
          time = current < 5 ? 100 / current : current < 10 ? 10 / current : 0.1;
          break;
        case "D":
          time = current < 10 ? 100 / current : current < 20 ? 10 / current : 0.1;
          break;
        default:
          time = 100 / current;
      }
      
      points.push({ current, time: Math.max(0.01, time) });
    }
    return points;
  };

  const curveData = generateCurve();

  return (
    <DashboardCard>
      <CardHeader 
        title="Tripping Characteristic" 
        subtitle={`Type ${mcbType} MCB (log-log scale)`}
      />

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="current"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: "I/In", position: "bottom", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              scale="log"
              domain={[1, 20]}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: "Time (s)", angle: -90, position: "insideLeft", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              scale="log"
              domain={[0.01, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value.toFixed(2)}s`, "Trip Time"]}
              labelFormatter={(label) => `${label}x In`}
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
            />
            {data.map((point, index) => (
              <ReferenceLine
                key={index}
                x={point.current}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
