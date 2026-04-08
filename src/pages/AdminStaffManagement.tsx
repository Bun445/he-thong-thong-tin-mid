import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAFF_MEMBERS, type EnquiryStatus, STATUS_CONFIG } from "@/lib/data";
import { useData } from "@/lib/DataContext";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  CircleAlert,
  ClipboardCheck,
  LoaderCircle,
  Search,
  UserCheck,
  ShieldCheck,
  Clock3,
  Eye,
} from "lucide-react";

const ACTIVE_STATUSES: EnquiryStatus[] = ["New", "AI Triaged", "In Progress", "Escalated"];

const AdminStaffManagement = () => {
  const { enquiries, chatLogs, appointments, enquiryHistory, updateEnquiryStatus, assignEnquiry, updateAppointmentStatus, getStaffName } = useData();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const actorName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Staff";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignmentDraft, setAssignmentDraft] = useState<Record<string, string>>({});

  const visibleEnquiries = useMemo(() => {
    let data = enquiries.filter((e) =>
      isAdmin ? true : !e.staffId || e.staffId === currentUser?.id
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((e) => e.status === statusFilter);
    }

    return data.sort((a, b) => b.id.localeCompare(a.id));
  }, [currentUser?.id, enquiries, isAdmin, search, statusFilter]);

  const pendingQueue = visibleEnquiries.filter((e) => e.status === "New" || e.status === "AI Triaged");
  const activeWork = visibleEnquiries.filter((e) => ACTIVE_STATUSES.includes(e.status));
  const escalated = visibleEnquiries.filter((e) => e.status === "Escalated");
  const pendingApprovals = appointments.filter((a) =>
    a.status === "Pending Approval" && (isAdmin || a.staffId === currentUser?.id)
  );
  const myAssigned = enquiries.filter((e) => e.staffId === currentUser?.id && ACTIVE_STATUSES.includes(e.status)).length;
  const myResolved = enquiries.filter((e) => e.staffId === currentUser?.id && (e.status === "Resolved" || e.status === "Closed")).length;
  const staffWorkload = STAFF_MEMBERS.map((staff) => {
    const activeCount = enquiries.filter(
      (e) => e.staffId === staff.staffId && ACTIVE_STATUSES.includes(e.status)
    ).length;
    const resolvedCount = enquiries.filter(
      (e) => e.staffId === staff.staffId && (e.status === "Resolved" || e.status === "Closed")
    ).length;
    return {
      ...staff,
      activeCount,
      resolvedCount,
    };
  }).sort((a, b) => b.activeCount - a.activeCount);
  const recentAudit = enquiryHistory.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-display">Operations Workspace</h1>
            </div>
            <p className="mt-1 ml-12 text-muted-foreground text-sm">
              {isAdmin
                ? "Monitor system-wide queue, distribute workload, and control approvals."
                : "Process student enquiries assigned to you and claim new queue items."}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/30">
              <Clock3 className="mr-1 h-3 w-3" />
              {activeWork.length} active
            </Badge>
            <Badge variant="outline" className="text-xs bg-warning/10 text-yellow-700 dark:text-yellow-400 border-warning/30">
              <CircleAlert className="mr-1 h-3 w-3" />
              {pendingQueue.length} waiting triage
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{isAdmin ? "Pending Triage" : "Queue You Can Claim"}</p>
            <p className="text-2xl font-bold font-display mt-1">
              {isAdmin ? pendingQueue.length : visibleEnquiries.filter((e) => !e.staffId && (e.status === "New" || e.status === "AI Triaged")).length}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{isAdmin ? "Escalated Cases" : "My Active Cases"}</p>
            <p className="text-2xl font-bold font-display mt-1">{isAdmin ? escalated.length : myAssigned}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{isAdmin ? "Pending Approvals" : "My Pending Approvals"}</p>
            <p className="text-2xl font-bold font-display mt-1">{pendingApprovals.length}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{isAdmin ? "Total Active Work" : "My Resolved Cases"}</p>
            <p className="text-2xl font-bold font-display mt-1">{isAdmin ? activeWork.length : myResolved}</p>
          </div>
        </div>
        {!isAdmin && (
          <p className="text-xs text-muted-foreground -mt-2">
            Staff can resolve an enquiry only after posting at least one staff reply in the conversation.
          </p>
        )}

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 pb-4">
            <h2 className="text-lg font-semibold font-display">Enquiry Management Queue</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID, subject, category..."
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {(["New", "AI Triaged", "In Progress", "Escalated", "Resolved", "Closed"] as EnquiryStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t bg-muted/30 text-left text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Enquiry</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Current Owner</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-sm text-muted-foreground">
                      No enquiries match the current filters.
                    </td>
                  </tr>
                ) : (
                  visibleEnquiries.map((enquiry) => {
                    const statusConfig = STATUS_CONFIG[enquiry.status];
                    const draftStaffId = assignmentDraft[enquiry.id] || enquiry.staffId || STAFF_MEMBERS[0]?.staffId || "";
                    const hasStaffReply = chatLogs.some(
                      (log) => log.enquiryId === enquiry.id && log.sender === "staff"
                    );
                    const canStaffResolve =
                      enquiry.staffId === currentUser?.id && hasStaffReply;
                    return (
                      <tr key={enquiry.id} className="border-t text-sm">
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs text-muted-foreground mb-1">{enquiry.id}</p>
                          <p className="font-medium">{enquiry.subject}</p>
                          <p className="text-xs text-muted-foreground">{enquiry.category}</p>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-sm text-muted-foreground">
                          {getStaffName(enquiry.staffId)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={cn("text-xs border", statusConfig.className)}>
                            <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full inline-block", statusConfig.dot)} />
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <Button variant="outline" size="sm" asChild className="text-xs">
                              <Link to={`/enquiries/${enquiry.id}`}>
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                View
                              </Link>
                            </Button>
                            {isAdmin ? (
                              <>
                                {(!enquiry.staffId || enquiry.status === "Escalated") && (
                                  <>
                                    <Select
                                      value={draftStaffId}
                                      onValueChange={(value) => setAssignmentDraft((prev) => ({ ...prev, [enquiry.id]: value }))}
                                    >
                                      <SelectTrigger className="w-[210px] h-8 text-xs">
                                        <SelectValue placeholder="Assign staff" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {STAFF_MEMBERS.map((staff) => (
                                          <SelectItem key={staff.staffId} value={staff.staffId}>
                                            {staff.firstName} {staff.lastName}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => assignEnquiry(enquiry.id, draftStaffId, actorName)}
                                    >
                                      <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                                      {enquiry.staffId ? "Reassign" : "Assign"}
                                    </Button>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {!enquiry.staffId && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => assignEnquiry(enquiry.id, currentUser?.id || "", actorName)}
                                  >
                                    <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                                    Assign to Me
                                  </Button>
                                )}
                                {enquiry.staffId === currentUser?.id && enquiry.status !== "In Progress" && enquiry.status !== "Resolved" && enquiry.status !== "Closed" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => updateEnquiryStatus(enquiry.id, "In Progress", "Staff started processing", actorName)}
                                  >
                                    <LoaderCircle className="mr-1.5 h-3.5 w-3.5" />
                                    In Progress
                                  </Button>
                                )}
                                {enquiry.staffId === currentUser?.id && enquiry.status !== "Escalated" && enquiry.status !== "Resolved" && enquiry.status !== "Closed" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => updateEnquiryStatus(enquiry.id, "Escalated", "Escalated by staff for admin review", actorName)}
                                  >
                                    Escalate
                                  </Button>
                                )}
                              </>
                            )}
                            {isAdmin && enquiry.status !== "In Progress" && enquiry.status !== "Resolved" && enquiry.status !== "Closed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => updateEnquiryStatus(enquiry.id, "In Progress", "Moved to active processing", actorName)}
                              >
                                <LoaderCircle className="mr-1.5 h-3.5 w-3.5" />
                                In Progress
                              </Button>
                            )}
                            {isAdmin && enquiry.status !== "Resolved" && enquiry.status !== "Closed" && (
                              <Button
                                size="sm"
                                className="text-xs"
                                onClick={() => updateEnquiryStatus(enquiry.id, "Resolved", "Marked as resolved from operations workspace", actorName)}
                              >
                                <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                                Resolve
                              </Button>
                            )}
                            {!isAdmin && enquiry.staffId === currentUser?.id && enquiry.status !== "Resolved" && enquiry.status !== "Closed" && (
                              <Button
                                size="sm"
                                className="text-xs"
                                disabled={!canStaffResolve}
                                onClick={() => updateEnquiryStatus(enquiry.id, "Resolved", "Resolved by staff after response", actorName)}
                              >
                                <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                                {canStaffResolve ? "Resolve" : "Reply First"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {isAdmin && (
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <h2 className="text-lg font-semibold font-display mb-4">Staff Workload</h2>
              <div className="space-y-3">
                {staffWorkload.map((staff) => (
                  <div key={staff.staffId} className="rounded-lg border bg-muted/30 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{staff.firstName} {staff.lastName}</p>
                        <p className="text-xs text-muted-foreground">{staff.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-warning/40 text-yellow-700 dark:text-yellow-400 bg-warning/10">
                          Active: {staff.activeCount}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-success/40 text-green-700 dark:text-green-400 bg-success/10">
                          Resolved: {staff.resolvedCount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={cn("rounded-xl border bg-card shadow-sm p-6", isAdmin ? "" : "xl:col-span-2")}>
            <h2 className="text-lg font-semibold font-display mb-4">After-hours Approval Queue</h2>
            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending approval requests.</p>
              ) : (
                pendingApprovals.map((appt) => (
                  <div key={appt.id} className="rounded-lg border bg-muted/30 px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{appt.title}</p>
                        <p className="text-xs text-muted-foreground">{appt.date} · {appt.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs border-warning/40 text-yellow-700 dark:text-yellow-400 bg-warning/10">
                        Pending Approval
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Staff: {getStaffName(appt.staffId)} · Student: {appt.studentId}
                    </p>
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-success/40 text-green-700 dark:text-green-400 hover:bg-success/10"
                          onClick={() => updateAppointmentStatus(appt.id, "Upcoming")}
                        >
                          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                          onClick={() => updateAppointmentStatus(appt.id, "Cancelled")}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Waiting for admin approval. You can monitor status here.
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {isAdmin && (
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h2 className="text-lg font-semibold font-display mb-4">Recent Admin Audit</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentAudit.length === 0 ? (
                <p className="text-sm text-muted-foreground">No audit records yet.</p>
              ) : (
                recentAudit.map((entry) => (
                  <div key={entry.historyId} className="rounded-lg border bg-muted/30 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{entry.enquiryId}</p>
                      <p className="text-[11px] text-muted-foreground">{entry.changeDate}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.oldStatus || "None"} → {entry.newStatus}
                    </p>
                    <p className="text-xs mt-1">{entry.note || "Status updated"}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">By {entry.changedBy}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStaffManagement;
