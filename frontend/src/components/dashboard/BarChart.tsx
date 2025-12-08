import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  yAxisLabel?: string;
  showLegend?: boolean;
  colors?: string[];
}

export function BarChart({
  title,
  data,
  yAxisLabel,
  colors = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))"],
}: BarChartProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="bg-primary text-primary-foreground px-4 py-2">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                label={
                  yAxisLabel
                    ? { value: yAxisLabel, angle: -90, position: "insideLeft", fontSize: 10 }
                    : undefined
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
