import { Link } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  CalendarDays,
  TrendingUp,
  Send,
  ArrowRight,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";
import EnquiriesTable from "@/components/EnquiriesTable";
import { useData } from "@/lib/DataContext";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const appointmentTypeBadge: Record<string, string> = {
  "In Person": "bg-info/10 text-info border-info/30",
  Online: "bg-success/10 text-success border-success/30",
  Phone: "bg-warning/10 text-yellow-700 dark:text-yellow-400 border-warning/30",
};

const Index = () => {
  const { enquiries, appointments, getStaffName } = useData();
  const { currentUser } = useAuth();
  const isStudent = currentUser?.role === "student";
  const isStaff = currentUser?.role === "staff";
  
  const displayAppts = appointments.filter((a) => {
    if (isStudent) return a.studentId === currentUser?.id;
    if (isStaff) return a.staffId === currentUser?.id;
    return true;
  });
  
  const upcomingAppts = displayAppts.filter((a) => a.status === "Upcoming");
  
  const myEnquiries = isStudent
    ? enquiries.filter((e) => e.studentId === currentUser?.id)
    : isStaff
    ? enquiries.filter((e) => !e.staffId || e.staffId === currentUser?.id)
    : enquiries;

  const total = myEnquiries.length;
  const pending = myEnquiries.filter((e) => e.status === "New" || e.status === "AI Triaged").length;
  const resolved = myEnquiries.filter((e) => e.status === "Resolved" || e.status === "Closed").length;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const unassigned = enquiries.filter((e) => !e.staffId && (e.status === "New" || e.status === "AI Triaged")).length;

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Welcome back, {currentUser?.firstName} 👋</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {isStudent
                ? "Here's an overview of your enquiries and upcoming appointments."
                : "Here's an overview of operational workload and appointments."}
            </p>
          </div>
          {isStudent ? (
            <Link to="/submit">
              <Button className="gap-2 shadow-sm">
                <Send className="h-4 w-4" />
                New Enquiry
              </Button>
            </Link>
          ) : (
            <Link to="/management">
              <Button className="gap-2 shadow-sm">
                <BriefcaseBusiness className="h-4 w-4" />
                Open Operations
              </Button>
            </Link>
          )}
        </div>

        {/* Alert banner if pending */}
        {pending > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
            <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
            <span className="text-yellow-800 dark:text-yellow-200">
              {isStudent ? (
                <>You have <strong>{pending} pending</strong> enquir{pending === 1 ? "y" : "ies"} awaiting a response.</>
              ) : (
                <>There are <strong>{pending} active</strong> enquir{pending === 1 ? "y" : "ies"} that need handling.</>
              )}
            </span>
            <Link to="/enquiries" className="ml-auto flex-shrink-0 text-xs font-medium text-warning hover:underline">
              View →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Enquiries"
            value={total}
            subtitle={isStudent ? "Your tickets" : isStaff ? "Assigned + unassigned queue" : "System total"}
            icon={MessageSquare}
            iconColor="text-primary"
            iconBg="bg-primary/10"
            trend="neutral"
          />
          <StatsCard
            title="Pending"
            value={pending}
            subtitle={isStudent ? "Awaiting response" : "Need staff handling"}
            icon={Clock}
            iconColor="text-yellow-600 dark:text-yellow-400"
            iconBg="bg-warning/10"
            trend={pending > 0 ? "down" : "neutral"}
          />
          <StatsCard
            title="Resolved"
            value={resolved}
            subtitle={`${rate}% resolution rate`}
            icon={CheckCircle}
            iconColor="text-green-600 dark:text-green-400"
            iconBg="bg-success/10"
            trend="up"
          />
          <StatsCard
            title="Appointments"
            value={isStudent ? upcomingAppts.length : unassigned}
            subtitle={isStudent ? "Upcoming sessions" : "Unassigned enquiries"}
            icon={CalendarDays}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-info/10"
            trend={isStudent ? "neutral" : unassigned > 0 ? "down" : "neutral"}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Enquiries table takes 2/3 */}
          <div className="xl:col-span-2">
            <EnquiriesTable compact maxRows={4} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between p-6 pb-4">
                <h3 className="text-base font-semibold font-display">Upcoming Appointments</h3>
                <Link to="/appointments" className="text-xs font-medium text-info hover:underline">
                  View all →
                </Link>
              </div>
              <div className="divide-y px-4 pb-4">
                {upcomingAppts.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No upcoming appointments</p>
                ) : (
                  upcomingAppts.map((appt) => (
                    <div key={appt.id} className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{appt.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{getStaffName(appt.staffId)}</p>
                          <p className="text-xs text-muted-foreground">{appt.department}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn("text-xs flex-shrink-0", appointmentTypeBadge[appt.type])}
                        >
                          {appt.type}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>{appt.date} · {appt.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <h3 className="text-base font-semibold font-display mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  ...(isStudent ? [{ label: "Submit a New Enquiry", icon: Send, to: "/submit", color: "text-primary" }] : []),
                  ...(isStudent ? [] : [{ label: "Open Operations Workspace", icon: BriefcaseBusiness, to: "/management", color: "text-primary" }]),
                  { label: isStudent ? "View All My Enquiries" : "View All Enquiries", icon: MessageSquare, to: "/enquiries", color: "text-info" },
                  { label: "Book an Appointment", icon: CalendarDays, to: "/appointments", color: "text-success" },
                  ...(!isStudent ? [{ label: "Track Service KPIs", icon: TrendingUp, to: "/kpi", color: "text-warning" }] : []),
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center justify-between rounded-lg border border-transparent bg-muted/40 px-4 py-3 text-sm font-medium transition-all duration-200 hover:border-border hover:bg-muted hover:shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className={cn("h-4 w-4", action.color)} />
                      <span>{action.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
