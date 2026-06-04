import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

/**
 * Props for the StatCard component.
 */
export interface StatCardProps {
  /** The title of the statistic */
  title: string;
  /** The numerical value to display */
  value: number;
  /** The icon to display alongside the title */
  icon: React.ReactNode;
}

/**
 * A reusable component to display a single statistic in a card format.
 *
 * @param props - The properties for the StatCard component.
 * @returns A rendered card displaying the statistic.
 */
export const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
