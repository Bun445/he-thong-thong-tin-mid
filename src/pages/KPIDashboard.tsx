import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Star,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { KPI_DATA } from "@/lib/data";
import { useData } from "@/lib/DataContext";
import { cn } from "@/lib/utils";

const KpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof TrendingUp;
  iconBg: string;
  trend?: "up" | "down";
}) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBg)}>
        <Icon className="h-5 w-5" />
      </div>
      {trend && (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            trend === "up"
              ? "border-success/40 text-green-700 dark:text-green-400 bg-success/10"
              : "border-destructive/40 text-destructive bg-destructive/10"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-0.5" />
          )}
          {trend === "up" ? "+12%" : "-5%"}
        </Badge>
      )}
    </div>
    <p className="text-2xl font-bold font-display">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
  </div>
);

const KPIDashboard = () => {
  const { stats } = useData();

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-display">KPI Dashboard</h1>
            </div>
            <p className="mt-1 ml-12 text-muted-foreground text-sm">
              Real-time operational metrics and performance analytics.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-success/10 text-green-700 dark:text-green-400 border-success/30">
              <span className="h-1.5 w-1.5 rounded-full bg-success inline-block mr-1.5" />
              Live Data
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> Export Report
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Total Enquiries"
            value={stats.totalEnquiries}
            subtitle="All time"
            icon={BarChart3}
            iconBg="bg-info/10 text-info"
            trend="up"
          />
          <KpiCard
            title="Resolution Rate"
            value={`${stats.resolutionRate}%`}
            subtitle="Target: 80%"
            icon={TrendingUp}
            iconBg="bg-success/10 text-success"
            trend="up"
          />
          <KpiCard
            title="Avg. Resolution"
            value={`${KPI_DATA.avgResolutionDays} days`}
            subtitle="Target: 3 days"
            icon={Clock}
            iconBg="bg-warning/10 text-yellow-600 dark:text-yellow-400"
            trend="up"
          />
          <KpiCard
            title="AI Automation"
            value={`${KPI_DATA.aiAutomationRate}%`}
            subtitle="Auto-resolved"
            icon={Bot}
            iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <KpiCard
            title="Satisfaction"
            value={`${KPI_DATA.satisfactionScore}/5`}
            subtitle={`${stats.feedbackAvg} avg rating`}
            icon={Star}
            iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            trend="up"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Enquiries Chart */}
          <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm p-6">
            <h3 className="text-base font-semibold font-display mb-4">Monthly Enquiries vs Resolved</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={KPI_DATA.monthlyEnquiries} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      fontSize: "12px",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="count" name="Total" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="text-base font-semibold font-display mb-4">By Category</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={KPI_DATA.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    style={{ fontSize: "10px" }}
                  >
                    {KPI_DATA.categoryBreakdown.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {KPI_DATA.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.category}</span>
                  </div>
                  <span className="font-medium">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Performance & Resolution Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Performance */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-3">
              <h3 className="text-base font-semibold font-display flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Staff Performance
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-t bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-6 py-2 text-left font-medium">Staff</th>
                  <th className="px-6 py-2 text-center font-medium">Resolved</th>
                  <th className="px-6 py-2 text-center font-medium">Avg Days</th>
                  <th className="px-6 py-2 text-center font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {KPI_DATA.staffPerformance.map((s) => (
                  <tr key={s.name} className="border-t text-sm hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant="secondary" className="text-xs">{s.resolved}</Badge>
                    </td>
                    <td className="px-6 py-3 text-center text-muted-foreground">{s.avgDays}d</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        {s.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resolution Trend */}
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="text-base font-semibold font-display mb-4">Resolution Trend</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={KPI_DATA.monthlyEnquiries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Received"
                    stroke="hsl(var(--info))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Metrics Banner */}
        <div className="rounded-xl border bg-gradient-to-r from-primary/5 via-info/5 to-success/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Automation Performance</p>
              <p className="text-xs text-muted-foreground">
                {KPI_DATA.aiAutomationRate}% of general enquiries resolved automatically · Average confidence score: {stats.avgAiConfidence}%
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-lg font-bold font-display text-primary">{stats.avgAiConfidence}%</p>
              <p className="text-[10px] text-muted-foreground">Avg Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold font-display text-success">{KPI_DATA.aiAutomationRate}%</p>
              <p className="text-[10px] text-muted-foreground">Auto-resolved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold font-display text-info">{stats.totalEnquiries}</p>
              <p className="text-[10px] text-muted-foreground">Processed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KPIDashboard;
