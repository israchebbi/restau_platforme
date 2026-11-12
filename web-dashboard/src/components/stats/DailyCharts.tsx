import type { ReactElement } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyStat } from "../../types";

// "2026-11-12" becomes "11-12"
const shortDate = (iso: string) => iso.slice(5);

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h2 className="font-medium text-slate-800 mb-3">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DailyCharts({ data }: { data: DailyStat[] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard title="Orders per day">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tickFormatter={shortDate} fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip />
          <Bar
            dataKey="orders"
            name="Orders"
            fill="#ea580c"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>

      <ChartCard title="Sales per day (DT)">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tickFormatter={shortDate} fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartCard>
    </div>
  );
}