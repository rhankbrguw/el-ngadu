import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  /** Optional href to make the card clickable */
  href?: string;
}

/**
 * A reusable component to display a single statistic in a card format.
 *
 * @param props - The properties for the StatCard component.
 * @returns A rendered card displaying the statistic.
 */
export const StatCard = ({ title, value, icon, href }: StatCardProps) => {
  const CardContentWrapper = (
    <Card className={cn(
      href && "cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link to={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        {CardContentWrapper}
      </Link>
    );
  }

  return CardContentWrapper;
};
