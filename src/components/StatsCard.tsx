import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-muted-foreground",
  iconBg = "bg-muted",
  trend = "neutral",
}: StatsCardProps) => {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div className="group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold font-display tracking-tight">{value}</p>
          <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="h-3 w-3" />
            <span>{subtitle}</span>
          </div>
        </div>
        <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
