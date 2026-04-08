import { useState, useMemo } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  LoaderCircle,
  Siren,
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox,
  Trash,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Enquiry, type EnquiryStatus, type EnquiryCategory, STATUS_CONFIG } from "@/lib/data";
import { useData } from "@/lib/DataContext";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";



const priorityConfig: Record<string, string> = {
  Urgent: "text-destructive font-semibold",
  High: "text-orange-600 dark:text-orange-400 font-medium",
  Medium: "text-blue-600 dark:text-blue-400",
  Low: "text-muted-foreground",
};

const PAGE_SIZE = 5;

interface EnquiriesTableProps {
  compact?: boolean;
  maxRows?: number;
}

const EnquiriesTable = ({ compact = false, maxRows }: EnquiriesTableProps) => {
  const { enquiries, chatLogs, deleteEnquiry, updateEnquiryStatus } = useData();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Enquiry>("dateReceived");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(enquiries.map((e) => e.category))),
    [enquiries]
  );

  const filtered = useMemo(() => {
    let data = [...enquiries];
    if (currentUser?.role === "student") {
      data = data.filter(e => e.studentId === currentUser.id);
    } else if (currentUser?.role === "staff") {
      data = data.filter(e => !e.staffId || e.staffId === currentUser.id);
    }
    
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") data = data.filter((e) => e.status === statusFilter);
    if (categoryFilter !== "all") data = data.filter((e) => e.category === categoryFilter);
    data.sort((a, b) => {
      const av = a[sortField] as string;
      const bv = b[sortField] as string;
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return data;
  }, [search, statusFilter, categoryFilter, sortField, sortDir, enquiries, currentUser]);

  const displayData = maxRows ? filtered.slice(0, maxRows) : filtered;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = maxRows ? displayData : displayData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: keyof Enquiry) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
    setPage(1);
  };

  const isManagementRole = currentUser?.role === "staff" || currentUser?.role === "admin";
  const tableTitle = compact
    ? "Recent Enquiries"
    : currentUser?.role === "student"
    ? "My Enquiries"
    : currentUser?.role === "staff"
    ? "Teaching Queue"
    : "All Enquiries";

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 pb-4">
        <div>
          <h3 className="text-lg font-semibold font-display">
            {tableTitle}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} enquir{filtered.length === 1 ? "y" : "ies"} found
          </p>
        </div>
        {compact ? (
          <Link
            to="/enquiries"
            className="text-sm font-medium text-info hover:underline hover:text-info/80 transition-colors"
          >
            View all →
          </Link>
        ) : null}
      </div>

      {/* Filters – only in full mode */}
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-2 px-6 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="enquiry-search"
              placeholder="Search by ID, subject, category…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger id="status-filter" className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(["New", "AI Triaged", "In Progress", "Escalated", "Resolved", "Closed"] as EnquiryStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger id="category-filter" className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t bg-muted/30 text-left text-xs text-muted-foreground uppercase tracking-wide">
              <th className="px-6 py-3 font-medium">
                <button
                  onClick={() => toggleSort("id")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  ID <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 font-medium">
                <button
                  onClick={() => toggleSort("subject")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Subject <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 font-medium hidden sm:table-cell">Category</th>
              {!compact && (
                <th className="px-6 py-3 font-medium hidden lg:table-cell">Priority</th>
              )}
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">
                <button
                  onClick={() => toggleSort("dateReceived")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Date <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Inbox className="h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">No enquiries found</p>
                    <p className="text-xs">Try adjusting your filters or search term</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((enq) => {
                const sc = STATUS_CONFIG[enq.status];
                const canManageEnquiry =
                  currentUser?.role === "admin" ||
                  (currentUser?.role === "staff" && enq.staffId === currentUser.id);
                const hasStaffReply = chatLogs.some(
                  (log) => log.enquiryId === enq.id && log.sender === "staff"
                );
                const canResolve =
                  currentUser?.role === "admin" ||
                  (currentUser?.role === "staff" && enq.staffId === currentUser.id && hasStaffReply);
                return (
                  <tr
                    key={enq.id}
                    className="border-t text-sm hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {enq.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/enquiries/${enq.id}`}
                        className="font-medium hover:text-info hover:underline transition-colors line-clamp-1 max-w-[200px] block"
                      >
                        {enq.subject}
                      </Link>
                      {enq.staffProcessed && (
                        <p className="text-xs text-muted-foreground mt-0.5">{enq.staffProcessed}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <Badge variant="secondary" className="font-medium text-xs">
                        {enq.category}
                      </Badge>
                    </td>
                    {!compact && (
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={cn("text-xs", priorityConfig[enq.priority])}>
                          {enq.priority === "Urgent" ? "🔴 " : enq.priority === "High" ? "🟠 " : enq.priority === "Medium" ? "🔵 " : "⚪ "}
                          {enq.priority}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={cn("text-xs font-medium border whitespace-nowrap cursor-help", sc.className)}
                            >
                              <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full inline-block", sc.dot)} />
                              {sc.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{sc.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs hidden md:table-cell">
                      <div>{enq.dateReceived}</div>
                      {!compact && (
                        <div className="text-muted-foreground/60">Updated {enq.dateProcessed || enq.dateReceived}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            id={`actions-${enq.id}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/enquiries/${enq.id}`} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>

                          {isManagementRole && canManageEnquiry && (
                            <>
                              {enq.status !== "In Progress" && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    updateEnquiryStatus(
                                      enq.id,
                                      "In Progress",
                                      "Moved to active handling from enquiry list",
                                      currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "Staff"
                                    )
                                  }
                                >
                                  <LoaderCircle className="mr-2 h-4 w-4" /> Mark In Progress
                                </DropdownMenuItem>
                              )}
                              {enq.status !== "Escalated" && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    updateEnquiryStatus(
                                      enq.id,
                                      "Escalated",
                                      "Escalated from enquiry list",
                                      currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "Staff"
                                    )
                                  }
                                >
                                  <Siren className="mr-2 h-4 w-4" /> Escalate
                                </DropdownMenuItem>
                              )}
                              {enq.status !== "Resolved" && enq.status !== "Closed" && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  disabled={!canResolve}
                                  onClick={() =>
                                    updateEnquiryStatus(
                                      enq.id,
                                      "Resolved",
                                      "Resolved from enquiry list",
                                      currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "Staff"
                                    )
                                  }
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                            </>
                          )}
                          
                          {/* Only show delete for admin or student who owns it */}
                          {(currentUser?.role === "admin" || (currentUser?.role === "student" && currentUser.id === enq.studentId)) && (
                            <DropdownMenuItem className="cursor-pointer focus:text-destructive text-destructive" onClick={() => deleteEnquiry(enq.id)}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination – full mode only */}
      {!compact && totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesTable;
