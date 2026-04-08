import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { KNOWLEDGE_BASE } from "@/lib/data";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
  link?: { label: string; to: string };
}

const AI_RESPONSES: Record<string, { reply: string; suggestions?: string[]; link?: { label: string; to: string } }> = {
  default: {
    reply: "I'm not sure I understand. Could you try rephrasing, or choose one of the common topics below?",
    suggestions: ["Course transfer", "Fee payment", "Library access", "Reset password", "Book appointment"],
  },
  greeting: {
    reply: "Hello! 👋 I'm UniLink AI Assistant, available 24/7 to help you. I can answer general enquiries instantly, or escalate complex issues to the right staff member. How can I help you today?",
    suggestions: ["Track my enquiry", "Submit new enquiry", "Book appointment", "Knowledge base"],
  },
  transfer: {
    reply: "For course transfers, you'll need to submit an enquiry selecting 'Academic' as the category. The Faculty Transfer Committee meets bi-weekly. I can help you start the process now!",
    suggestions: ["Submit enquiry now", "What documents do I need?"],
    link: { label: "Submit Course Transfer Enquiry", to: "/submit" },
  },
  fee: {
    reply: "Tuition fees can be paid in full or in 3 instalments. Semester 1 is due by October 1st, Semester 2 by March 1st. Payment plans are available for financial hardship cases. Need more details?",
    suggestions: ["Payment plans", "Financial hardship", "Talk to finance team"],
    link: { label: "Contact Finance Office", to: "/submit" },
  },
  password: {
    reply: "To reset your password, visit it.uni.edu.vn/reset and enter your student ID. If MFA isn't working, the IT Help Desk can verify you manually. This is usually resolved within 24 hours.",
    suggestions: ["MFA not working", "Contact IT Help Desk"],
  },
  library: {
    reply: "The main library is open 8AM–10PM weekdays, 9AM–6PM weekends. After-hours access requires extended access privileges on your student card. I can help you request that!",
    suggestions: ["Request extended access", "Library resources"],
  },
  appointment: {
    reply: "You can book appointments with staff directly through UniLink's Smart Booking. Available slots sync with Outlook calendar. Note: after-hours appointments (outside 9AM–5PM) need manager approval.",
    suggestions: ["Book now", "View my appointments"],
    link: { label: "Book an Appointment", to: "/appointments" },
  },
  track: {
    reply: "You can track all your enquiries in the 'My Enquiries' page. Each enquiry shows its current status, assigned staff, and full conversation history. Let me take you there!",
    link: { label: "View My Enquiries", to: "/enquiries" },
  },
  escalate: {
    reply: "If you're not satisfied with a response, you can escalate your enquiry. This will route it to a senior staff member or manager for further review. Would you like to escalate a specific enquiry?",
    suggestions: ["Escalate ENQ-1042", "Escalate ENQ-1037"],
  },
  knowledge: {
    reply: "Our Knowledge Base has articles on common topics. Here are some popular ones:",
    suggestions: KNOWLEDGE_BASE.slice(0, 4).map((a) => a.title),
    link: { label: "Browse Knowledge Base", to: "/knowledge-base" },
  },
};

function getAiResponse(input: string): { reply: string; suggestions?: string[]; link?: { label: string; to: string } } {
  const q = input.toLowerCase();
  if (q.match(/^(hi|hello|hey|xin chào|chào)/)) return AI_RESPONSES.greeting;
  if (q.match(/transfer|chuyển|chuyển ngành/)) return AI_RESPONSES.transfer;
  if (q.match(/fee|payment|tuition|học phí|phí/)) return AI_RESPONSES.fee;
  if (q.match(/password|login|đăng nhập|mật khẩu|reset/)) return AI_RESPONSES.password;
  if (q.match(/library|thư viện|sách/)) return AI_RESPONSES.library;
  if (q.match(/appointment|book|lịch hẹn|đặt lịch|booking/)) return AI_RESPONSES.appointment;
  if (q.match(/track|theo dõi|enquir|yêu cầu|status/)) return AI_RESPONSES.track;
  if (q.match(/escalat|nâng cấp|khiếu nại|chuyển lên/)) return AI_RESPONSES.escalate;
  if (q.match(/knowledge|kb|faq|hướng dẫn|tài liệu|bài viết/)) return AI_RESPONSES.knowledge;
  if (q.match(/submit|gửi|tạo mới|new enquiry/)) return { reply: "Sure! I'll take you to the submission form.", link: { label: "Submit New Enquiry", to: "/submit" } };
  return AI_RESPONSES.default;
}

const now = () => {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi Alex! 👋 I'm UniLink AI, your 24/7 assistant. I can answer general questions instantly or connect you with the right staff for complex issues. How can I help?",
      timestamp: now(),
      suggestions: ["Track my enquiry", "Submit new enquiry", "Book appointment", "Knowledge base"],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: "user", text: msg, timestamp: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const resp = getAiResponse(msg);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "ai",
        text: resp.reply,
        timestamp: now(),
        suggestions: resp.suggestions,
        link: resp.link,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating button */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          open
            ? "bg-muted text-muted-foreground rotate-0"
            : "bg-primary text-primary-foreground animate-bounce hover:animate-none"
        )}
        aria-label="Toggle AI Chatbot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] flex flex-col rounded-2xl border bg-card shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b bg-primary text-primary-foreground rounded-t-2xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">UniLink AI Assistant</p>
              <p className="text-[10px] opacity-80 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                Online · 24/7 Support
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px] bg-primary-foreground/15 text-primary-foreground border-0">
              <Sparkles className="h-3 w-3 mr-1" /> AI
            </Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[350px] min-h-[250px]">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2", msg.sender === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5",
                    msg.sender === "ai" ? "bg-primary/10 text-primary" : "bg-info/10 text-info"
                  )}
                >
                  {msg.sender === "ai" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={cn("flex flex-col max-w-[80%]", msg.sender === "user" && "items-end")}>
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.sender === "ai"
                        ? "bg-muted/50 rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                  {/* Link */}
                  {msg.link && (
                    <Link
                      to={msg.link.to}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-info hover:underline"
                    >
                      <ArrowUpRight className="h-3 w-3" />
                      {msg.link.label}
                    </Link>
                  )}
                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full border bg-card hover:bg-muted transition-colors text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2.5 flex gap-2">
            <Input
              id="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question…"
              className="flex-1 text-sm h-9"
            />
            <Button
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              disabled={!input.trim()}
              onClick={() => handleSend()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
