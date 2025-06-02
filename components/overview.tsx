"use client";

import { useTheme } from "next-themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: any[]
}

export const Overview = ({ data }: OverviewProps) => {
  const { theme } = useTheme();
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} axisLine={false} />
        <Bar dataKey="total" fill={theme === 'dark' ? '#fefeff' : '#100b16'} radius={[4, 4, 0, 0]}  />
      </BarChart>
    </ResponsiveContainer>
  )
}