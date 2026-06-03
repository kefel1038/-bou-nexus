"use client";

import {
  PieChart as RechartsPie,
  Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#4A2C1B", "#C5A880", "#8C6239", "#BBA081", "#D2BFA6", "#E4D4C3", "#FAF7F2", "#170E08"];

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export default function PieChart({ data, height = 300, innerRadius = 60, outerRadius = 100 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
