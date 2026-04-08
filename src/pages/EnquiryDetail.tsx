import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  User,
  Tag,
  Calendar,
  MessageSquare,
  Send,
  AlertTriangle,
  CheckCircle2,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useData } from "@/lib/DataContext";
import { useAuth } from "@/lib/AuthContext";
import { STATUS_CONFIG } from "@/lib/data";



const priorityColors: Record<string, string> = {
  Urgent: "text-destructive",
  High: "text-orange-600 dark:text-orange-400",
  Medium: "text-blue-600 dark:text-blue-400",
  Low: "text-muted-foreground",
};

const EnquiryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enquiries, chatLogs, addChatLog, updateEnquiryStatus, getStaffName, enquiryHistory } = useData();
  const { currentUser } = useAuth();
  const enquiry = enquiries.find((e) => e.id === id);
  const [comment, setComment] = useState("");

  const history = enquiryHistory
    .filter((h) => h.enquiryId === id)
    .sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime());

  const messages = chatLogs
    .filter((log) => log.enquiryId === id)
  // they are usually ordered by insertion anyway
  // but just mapping them


  if (!enquiry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
          <h1 className="text-2xl font-bold font-display">Enquiry Not Found</h1>
          <p className="text-muted-foreground text-sm">The enquiry ID <span className="font-mono">{id}</span> does not exist.</p>
          <Button asChild><Link to="/enquiries">← Back to My Enquiries</Link></Button>
        </div>
      </div>
    );
  }

  const sc = STATUS_CONFIG[enquiry.status] || { className: "bg-muted", dot: "bg-muted-foreground" };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        {/* Back button + header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{enquiry.id}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className={cn("text-xs font-medium border cursor-help", sc.className)}>
                      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full inline-block", sc.dot)} />
                      {enquiry.status}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{sc.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="secondary" className="text-xs">{enquiry.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold font-display mt-1">{enquiry.subject}</h1>
          </div>
        </div>
        <div className="flex sm:justify-end border-b pb-4 sm:border-0 sm:pb-0">
          {enquiry.status !== "Resolved" && enquiry.status !== "Closed" && (
            <Button
              variant="outline"
              className="gap-2 text-success hover:text-green-700 hover:bg-success/10 border-success/30"
              onClick={() => updateEnquiryStatus(enquiry.id, "Resolved")}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark as Resolved
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: description + messages */}
          <div className="lg:col-span-2 space-y-4">
            {/* Description */}
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <h2 className="text-base font-semibold font-display mb-3">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{enquiry.description}</p>
            </div>

            {/* Message thread */}
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <h2 className="text-base font-semibold font-display mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Conversation
              </h2>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No messages yet.</p>
                )}
                {messages.map((msg) => (
                  <div key={msg.chatId} className={cn("flex gap-3", msg.sender === "student" && "flex-row-reverse")}>
                    <div className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      msg.sender === "student" ? "bg-primary text-primary-foreground" :
                        msg.sender === "staff" ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"
                    )}>
                      {msg.sender === "student" ? (msg.senderName?.[0] || "S") : msg.sender === "staff" ? (msg.senderName?.[0] || "ST") : "★"}
                    </div>
                    <div className={cn("flex-1 max-w-[80%]", msg.sender === "student" && "flex flex-col items-end")}>
                      {msg.senderName && (
                        <p className="text-xs font-medium text-muted-foreground mb-1">{msg.senderName}</p>
                      )}
                      <div className={cn(
                        "rounded-xl px-4 py-2.5 text-sm",
                        msg.sender === "student"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : msg.sender === "system"
                            ? "bg-muted text-muted-foreground italic text-center w-full rounded-lg text-xs"
                            : "bg-muted/50 rounded-tl-sm text-foreground"
                      )}>
                        {msg.message}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              {enquiry.status !== "Closed" && (
                <div className="mt-6 border-t pt-4 space-y-3">
                  <Textarea
                    id="reply-input"
                    placeholder="Type your reply…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="resize-none min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      id="send-reply-btn"
                      disabled={comment.trim().length < 5}
                      className="gap-2"
                      onClick={() => {
                        addChatLog({
                          studentId: enquiry.studentId,
                          enquiryId: enquiry.id,
                          sender: currentUser?.role === "student" ? "student" : "staff",
                          senderName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User",
                          message: comment
                        });
                        setComment("");
                      }}
                    >
                      <Send className="h-4 w-4" /> Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: details */}
          <div className="space-y-4">
            <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold font-display">Details</h2>
              {[
                { icon: Clock, label: "Status", value: enquiry.status },
                { icon: Tag, label: "Category", value: enquiry.category },
                { icon: AlertTriangle, label: "Priority", value: enquiry.priority, className: priorityColors[enquiry.priority] },
                { icon: User, label: "Assigned To", value: getStaffName(enquiry.staffId) },
                { icon: Calendar, label: "Submitted", value: enquiry.dateReceived },
                { icon: Calendar, label: "Last Updated", value: enquiry.dateProcessed || enquiry.dateReceived },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={cn("text-sm font-medium", item.className)}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status History */}
            <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold font-display flex items-center gap-2">
                <History className="h-4 w-4" /> Status History
              </h2>
              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {history.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">No history records found.</p>
                )}
                {history.map((item, idx) => (
                  <div key={item.historyId} className="relative pl-6 space-y-1">
                    <div className={cn(
                      "absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 bg-background z-10",
                      idx === 0 ? "border-primary" : "border-muted-foreground/30"
                    )} />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold">{item.newStatus}</p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.changeDate}</span>
                    </div>
                    {item.note && <p className="text-[11px] text-muted-foreground line-clamp-2">{item.note}</p>}
                    <p className="text-[10px] text-muted-foreground/60">By {item.changedBy}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/enquiries">← Back to All Enquiries</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnquiryDetail;
