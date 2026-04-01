"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrafficPoint } from "@/store/dashboardApi";
import { formatTrafficAxis, shortMonthLabel } from "@/lib/dashboardFormat";

export function TrafficAreaChart({ data }: { data: TrafficPoint[] }) {
  const chartData = data.map((point) => ({
    date: shortMonthLabel(point.DATE),
    traffic: Math.round(point.TRAFFIC),
  }));
  if (chartData.length < 2) return null;

  const values = chartData.map((item) => item.traffic);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const domainMin = min === max ? min - 1 : min;
  const domainMax = min === max ? max + 1 : max;

  return (
    <div className="relative w-full">
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="traffic-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#edf2f7" strokeWidth={1} />
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[domainMin, domainMax]} />
            <Tooltip
              content={({ active, payload, label }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm">
                      <div className="mb-0.5 text-xs font-semibold text-gray-700">{label}</div>
                      <div className="text-[13px] font-medium text-[#2383eb]">
                        Traffic : {payload[0].value}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: "#9ca3af", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="traffic"
              stroke="#2383eb"
              strokeWidth={2}
              fill="url(#traffic-area)"
              dot={false}
              activeDot={{ r: 4, fill: "#2383eb", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 flex h-[120px] flex-col justify-between py-1 text-right text-[11px] font-medium tabular-nums text-[#8f97a8]">
        <span>{formatTrafficAxis(domainMax)}</span>
        <span>{formatTrafficAxis(domainMin)}</span>
      </div>
    </div>
  );
}
