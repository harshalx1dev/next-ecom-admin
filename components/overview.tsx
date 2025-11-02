"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DataItem {
  name: string;
  total: number;
}

interface OverviewProps {
  data: DataItem[]
}

export const Overview = ({ data }: OverviewProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} axisLine={false} />
        <Bar dataKey="total" fill="var(--foreground)" radius={[4, 4, 0, 0]}  />
      </BarChart>
    </ResponsiveContainer>
  )
}