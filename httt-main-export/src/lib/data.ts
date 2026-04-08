// ============================================================
// UniLink Data Layer — aligned with ERD & Use Case diagrams
// ============================================================

// --- ENUMS & TYPES ---
export type UserRole = "student" | "admin_officer" | "sso" | "manager" | "director";

export type EnquiryStatus = "New" | "AI Triaged" | "In Progress" | "Escalated" | "Resolved" | "Closed";
export type EnquiryCategory = "Academic" | "Facilities" | "Finance" | "IT Support" | "Wellbeing" | "Admissions";
export type EnquiryPriority = "Low" | "Medium" | "High" | "Urgent";
export type ComplexityLevel = "General" | "Complex";

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateRegistered: string;
  adminNotes?: string;
  aiConfidenceScore?: number;
}

export interface Staff {
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  specialty: string;
}

export interface Enquiry {
  id: string;
  studentId: string;
  staffId?: string;
  subject: string;
  description: string;
  category: EnquiryCategory;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  complexity: ComplexityLevel;
  dateReceived: string;
  dateProcessed?: string;
  staffProcessed?: string;
  locationLink?: string;
  aiConfidenceScore: number;
  aiSuggestedCategory?: EnquiryCategory;
  attachments?: Attachment[];
}

export interface Appointment {
  id: string;
  enquiryId?: string;
  studentId: string;
  staffId: string;
  date: string;
  time: string;
  locationOrLink: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Pending Approval";
  type: "In Person" | "Online" | "Phone";
  title: string;
  department: string;
  isAfterHours?: boolean;
  managerApproved?: boolean;
}

export interface ChatLog {
  chatId: string;
  studentId: string;
  enquiryId?: string;
  sender: "student" | "ai" | "staff" | "system";
  senderName?: string;
  message: string;
  timestamp: string;
}

export interface Feedback {
  feedbackId: string;
  enquiryId: string;
  studentId: string;
  serviceRating: number;
  timelinessRating: number;
  overallRating: number;
  comments: string;
  dateSubmitted: string;
}

export interface Document {
  documentId: string;
  title: string;
  category: string;
  uploadedBy: string;
  fileURL: string;
}

export interface Attachment {
  attachmentId: string;
  enquiryId: string;
  uploadedBy: string;
  fileURL: string;
  fileName: string;
  uploadDate: string;
}

export interface EnquiryHistory {
  historyId: string;
  enquiryId: string;
  oldStatus: EnquiryStatus | "";
  newStatus: EnquiryStatus;
  changedBy: string;
  changeDate: string;
  note?: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  isRead: boolean;
  dateSent: string;
  link?: string;
  type: "info" | "warning" | "success" | "error";
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: EnquiryCategory;
  content: string;
  tags: string[];
  views: number;
  helpful: number;
}

// --- MOCK DATA ---
const today = new Date();
export const formatDate = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
export const formatTime = (daysOffset: number, timeStr: string) => {
  return `${formatDate(daysOffset)} ${timeStr}`;
};

export const STATUS_CONFIG: Record<EnquiryStatus, { label: string; className: string; dot: string; description: string }> = {
  "New": { 
    label: "New", 
    className: "bg-info/15 text-blue-700 dark:text-blue-400 border-info/40", 
    dot: "bg-info",
    description: "Your enquiry has been received and is waiting for initial review."
  },
  "AI Triaged": { 
    label: "AI Triaged", 
    className: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800", 
    dot: "bg-purple-500",
    description: "Our AI system has analyzed and categorized your enquiry for faster processing."
  },
  "In Progress": { 
    label: "In Progress", 
    className: "bg-warning/15 text-yellow-700 dark:text-yellow-400 border-warning/40", 
    dot: "bg-warning",
    description: "A staff member is currently working on your enquiry."
  },
  "Escalated": { 
    label: "Escalated", 
    className: "bg-destructive/15 text-red-700 dark:text-red-400 border-destructive/40", 
    dot: "bg-destructive",
    description: "Your enquiry has been forwarded to a specialist or manager for further review."
  },
  "Resolved": { 
    label: "Resolved", 
    className: "bg-success/15 text-green-700 dark:text-green-400 border-success/40", 
    dot: "bg-success",
    description: "A solution has been provided. Please review and provide feedback."
  },
  "Closed": { 
    label: "Closed", 
    className: "bg-muted text-muted-foreground border-border", 
    dot: "bg-muted-foreground",
    description: "This enquiry is complete and no further action is required."
  },
};

export const CURRENT_STUDENT: Student = {
  studentId: "STU-001",
  firstName: "Alex",
  lastName: "Johnson",
  email: "s.alex.johnson@uni.edu.vn",
  phone: "+84 912 345 678",
  dateRegistered: formatDate(-400),
};

export const STAFF_MEMBERS: Staff[] = [
  { staffId: "STF-001", firstName: "Sarah", lastName: "Webb", email: "s.webb@uni.edu.vn", role: "sso", specialty: "Academic Advisory" },
  { staffId: "STF-002", firstName: "Karen", lastName: "Osei", email: "k.osei@uni.edu.vn", role: "admin_officer", specialty: "Finance" },
  { staffId: "STF-003", firstName: "James", lastName: "Park", email: "j.park@uni.edu.vn", role: "sso", specialty: "Careers Guidance" },
  { staffId: "STF-004", firstName: "Amelia", lastName: "Stone", email: "a.stone@uni.edu.vn", role: "sso", specialty: "Student Wellbeing" },
  { staffId: "STF-005", firstName: "Michael", lastName: "Tran", email: "m.tran@uni.edu.vn", role: "manager", specialty: "Operations Management" },
  { staffId: "STF-006", firstName: "Lisa", lastName: "Chen", email: "l.chen@uni.edu.vn", role: "admin_officer", specialty: "IT Support" },
  { staffId: "STF-007", firstName: "David", lastName: "Nguyen", email: "d.nguyen@uni.edu.vn", role: "director", specialty: "Student Services" },
];

export const ENQUIRIES: Enquiry[] = [
  {
    id: "ENQ-1042",
    studentId: "STU-001",
    staffId: "STF-001",
    subject: "Course transfer request",
    category: "Academic",
    status: "In Progress",
    priority: "High",
    complexity: "Complex",
    dateReceived: formatDate(-8),
    dateProcessed: formatDate(-7),
    staffProcessed: "Dr. Sarah Webb",
    description: "Requesting transfer from Bachelor of Science to Bachelor of Engineering. Need guidance on credit transfer process and any prerequisite requirements.",
    aiConfidenceScore: 0.72,
    aiSuggestedCategory: "Academic",
  },
  {
    id: "ENQ-1041",
    studentId: "STU-001",
    staffId: "STF-006",
    subject: "Library access issue",
    category: "Facilities",
    status: "Resolved",
    priority: "Medium",
    complexity: "General",
    dateReceived: formatDate(-11),
    dateProcessed: formatDate(-9),
    staffProcessed: "Facilities Team",
    description: "Student card not granting access to the main library after 8pm. Issue has been resolved by updating card permissions.",
    aiConfidenceScore: 0.95,
    aiSuggestedCategory: "Facilities",
  },
  {
    id: "ENQ-1040",
    studentId: "STU-001",
    subject: "Fee payment clarification",
    category: "Finance",
    status: "New",
    priority: "Urgent",
    complexity: "General",
    dateReceived: formatDate(-13),
    description: "Need clarification on tuition fee payment schedule and available payment plans for the upcoming semester.",
    aiConfidenceScore: 0.88,
    aiSuggestedCategory: "Finance",
  },
  {
    id: "ENQ-1039",
    studentId: "STU-001",
    staffId: "STF-001",
    subject: "Exam timetable query",
    category: "Academic",
    status: "Resolved",
    priority: "Low",
    complexity: "General",
    dateReceived: formatDate(-16),
    dateProcessed: formatDate(-14),
    staffProcessed: "Academic Registry",
    description: "Query about clash in exam timetable between COMP3001 and MATH2010. Resolved with alternative exam date.",
    aiConfidenceScore: 0.91,
    aiSuggestedCategory: "Academic",
  },
  {
    id: "ENQ-1038",
    studentId: "STU-002",
    staffId: "STF-006",
    subject: "Student portal login problem",
    category: "IT Support",
    status: "Resolved",
    priority: "High",
    complexity: "General",
    dateReceived: formatDate(-18),
    dateProcessed: formatDate(-17),
    staffProcessed: "IT Help Desk",
    description: "Unable to login to the student portal after password reset. Multi-factor authentication not receiving SMS codes.",
    aiConfidenceScore: 0.97,
    aiSuggestedCategory: "IT Support",
  },
  {
    id: "ENQ-1037",
    studentId: "STU-001",
    staffId: "STF-004",
    subject: "Mental health support referral",
    category: "Wellbeing",
    status: "Escalated",
    priority: "High",
    complexity: "Complex",
    dateReceived: formatDate(-21),
    dateProcessed: formatDate(-20),
    staffProcessed: "Student Wellbeing",
    description: "Requesting referral to counselling services and information on available mental health resources on campus.",
    aiConfidenceScore: 0.65,
    aiSuggestedCategory: "Wellbeing",
  },
  {
    id: "ENQ-1036",
    studentId: "STU-003",
    subject: "Scholarship application status",
    category: "Finance",
    status: "AI Triaged",
    priority: "Medium",
    complexity: "General",
    dateReceived: formatDate(-26),
    description: "Follow-up on scholarship application submitted in February. No response received after initial submission.",
    aiConfidenceScore: 0.82,
    aiSuggestedCategory: "Finance",
  },
  {
    id: "ENQ-1035",
    studentId: "STU-001",
    staffId: "STF-002",
    subject: "Graduation ceremony enquiry",
    category: "Admissions",
    status: "Closed",
    priority: "Low",
    complexity: "General",
    dateReceived: formatDate(-31),
    dateProcessed: formatDate(-28),
    staffProcessed: "Student Services",
    description: "Information requested about graduation ceremony dates, guest ticket allocation, and academic gown rental.",
    aiConfidenceScore: 0.93,
    aiSuggestedCategory: "Admissions",
  },
  {
    id: "ENQ-1034",
    studentId: "STU-004",
    staffId: "STF-003",
    subject: "Internship credit application",
    category: "Academic",
    status: "In Progress",
    priority: "Medium",
    complexity: "Complex",
    dateReceived: formatDate(-33),
    dateProcessed: formatDate(-31),
    staffProcessed: "James Park",
    description: "Application to receive academic credit for summer internship at a tech company. Need supervisor approval form.",
    aiConfidenceScore: 0.78,
    aiSuggestedCategory: "Academic",
  },
  {
    id: "ENQ-1033",
    studentId: "STU-005",
    subject: "Parking permit renewal",
    category: "Facilities",
    status: "New",
    priority: "Low",
    complexity: "General",
    dateReceived: formatDate(-35),
    description: "Need to renew campus parking permit for the next semester. Current permit expires March 31.",
    aiConfidenceScore: 0.99,
    aiSuggestedCategory: "Facilities",
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "APT-201",
    enquiryId: "ENQ-1042",
    studentId: "STU-001",
    staffId: "STF-001",
    title: "Academic Progress Review",
    department: "Faculty of Engineering",
    date: formatDate(1),
    time: "2:00 PM",
    locationOrLink: "Room 301, Block A",
    type: "In Person",
    status: "Upcoming",
  },
  {
    id: "APT-200",
    studentId: "STU-001",
    staffId: "STF-002",
    title: "Financial Aid Consultation",
    department: "Finance Office",
    date: formatDate(3),
    time: "10:30 AM",
    locationOrLink: "https://meet.uni.edu.vn/fin-aid-alex",
    type: "Online",
    status: "Upcoming",
  },
  {
    id: "APT-199",
    studentId: "STU-001",
    staffId: "STF-003",
    title: "Career Guidance Session",
    department: "Careers Service",
    date: formatDate(-5),
    time: "3:00 PM",
    locationOrLink: "Room 105, Student Hub",
    type: "In Person",
    status: "Completed",
  },
  {
    id: "APT-198",
    studentId: "STU-001",
    staffId: "STF-004",
    title: "Wellbeing Check-in",
    department: "Student Wellbeing",
    date: formatDate(-15),
    time: "11:00 AM",
    locationOrLink: "+84 912 000 111",
    type: "Phone",
    status: "Completed",
  },
  {
    id: "APT-197",
    studentId: "STU-001",
    staffId: "STF-005",
    title: "After-hours Consultation",
    department: "Student Services",
    date: formatDate(5),
    time: "7:00 PM",
    locationOrLink: "https://meet.uni.edu.vn/evening",
    type: "Online",
    status: "Pending Approval",
    isAfterHours: true,
    managerApproved: false,
  },
];

export const ENQUIRY_HISTORY: EnquiryHistory[] = [
  { historyId: "H-001", enquiryId: "ENQ-1042", oldStatus: "", newStatus: "New", changedBy: "System", changeDate: "Mar 28, 2026 09:00", note: "Enquiry submitted via UniLink Portal" },
  { historyId: "H-002", enquiryId: "ENQ-1042", oldStatus: "New", newStatus: "AI Triaged", changedBy: "AI Engine", changeDate: "Mar 28, 2026 09:01", note: "Auto-classified as Academic (72% confidence). Complexity: Complex → routed to SSO." },
  { historyId: "H-003", enquiryId: "ENQ-1042", oldStatus: "AI Triaged", newStatus: "In Progress", changedBy: "Dr. Sarah Webb", changeDate: "Mar 29, 2026 10:30", note: "Assigned to Dr. Sarah Webb for review" },
  { historyId: "H-004", enquiryId: "ENQ-1037", oldStatus: "In Progress", newStatus: "Escalated", changedBy: "Dr. Amelia Stone", changeDate: "Mar 18, 2026 14:00", note: "Escalated to Director — requires specialist referral approval" },
];

export const CHAT_LOGS: ChatLog[] = [
  { chatId: "C-001", studentId: "STU-001", enquiryId: "ENQ-1042", sender: "system", message: "Your enquiry has been received and auto-classified as Academic by our AI system.", timestamp: "Mar 28, 2026 · 09:01 AM" },
  { chatId: "C-002", studentId: "STU-001", enquiryId: "ENQ-1042", sender: "ai", senderName: "UniLink AI", message: "Hi Alex! I've analyzed your enquiry. This appears to be a course transfer request, which typically requires faculty-level approval. I've routed this to Dr. Sarah Webb in the Faculty of Engineering.", timestamp: "Mar 28, 2026 · 09:02 AM" },
  { chatId: "C-003", studentId: "STU-001", enquiryId: "ENQ-1042", sender: "staff", senderName: "Dr. Sarah Webb", message: "Hi Alex, I've reviewed your course transfer request. Can you please confirm which specific modules you've already completed in your current programme?", timestamp: "Mar 30, 2026 · 11:42 AM" },
  { chatId: "C-004", studentId: "STU-001", enquiryId: "ENQ-1042", sender: "student", senderName: "Alex Johnson", message: "Hi Dr. Webb, I've completed COMP1001, COMP1002, MATH1010, and PHYS1001. I also have a distinction in my first-year exams.", timestamp: "Mar 31, 2026 · 3:15 PM" },
  { chatId: "C-005", studentId: "STU-001", enquiryId: "ENQ-1042", sender: "staff", senderName: "Dr. Sarah Webb", message: "Thank you. I'll present your case to the Faculty Transfer Committee next week and you'll hear back by April 10th.", timestamp: "Apr 4, 2026 · 10:00 AM" },
];

export const FEEDBACKS: Feedback[] = [
  { feedbackId: "FB-001", enquiryId: "ENQ-1041", studentId: "STU-001", serviceRating: 5, timelinessRating: 4, overallRating: 5, comments: "Great response time! Issue was fixed quickly.", dateSubmitted: formatDate(-8) },
  { feedbackId: "FB-002", enquiryId: "ENQ-1039", studentId: "STU-001", serviceRating: 4, timelinessRating: 5, overallRating: 4, comments: "Exam clash was solved promptly with alternative date.", dateSubmitted: formatDate(-13) },
  { feedbackId: "FB-003", enquiryId: "ENQ-1035", studentId: "STU-001", serviceRating: 5, timelinessRating: 5, overallRating: 5, comments: "Very helpful information about graduation process.", dateSubmitted: formatDate(-26) },
];

export const KNOWLEDGE_BASE: KnowledgeBaseArticle[] = [
  { id: "KB-001", title: "How to request a course transfer", category: "Academic", content: "To request a course transfer, submit an enquiry through the UniLink portal selecting 'Academic' as the category. You'll need your current transcript and a statement of purpose. The Faculty Transfer Committee meets bi-weekly.", tags: ["transfer", "course", "faculty"], views: 234, helpful: 189 },
  { id: "KB-002", title: "Fee payment schedule and options", category: "Finance", content: "Tuition fees can be paid in full or in 3 instalments. Semester 1 fees are due by October 1st, Semester 2 by March 1st. Payment plans are available for students who qualify for financial hardship assistance.", tags: ["fees", "payment", "finance", "instalment"], views: 512, helpful: 402 },
  { id: "KB-003", title: "Library access and opening hours", category: "Facilities", content: "The main library is open 8AM–10PM weekdays and 9AM–6PM weekends. After-hours access requires a valid student card with extended access privileges. Contact Facilities to request extended access.", tags: ["library", "access", "hours"], views: 187, helpful: 156 },
  { id: "KB-004", title: "How to reset your student portal password", category: "IT Support", content: "Visit the IT self-service portal at it.uni.edu.vn/reset. Enter your student ID and registered email. If MFA is not working, contact the IT Help Desk directly for manual verification.", tags: ["password", "login", "portal", "MFA"], views: 892, helpful: 834 },
  { id: "KB-005", title: "Counselling and mental health services", category: "Wellbeing", content: "Free counselling is available to all students. Book via UniLink or call the Wellbeing Centre. Emergency support: 24/7 campus crisis line at 1800-XXX-XXX. Support is confidential.", tags: ["counselling", "mental health", "wellbeing", "crisis"], views: 345, helpful: 312 },
  { id: "KB-006", title: "Booking an appointment with staff", category: "Admissions", content: "Use the UniLink Smart Booking feature to select available time slots. Appointments sync with Outlook calendar automatically. After-hours appointments (outside 9AM–5PM) require manager approval.", tags: ["appointment", "booking", "calendar"], views: 267, helpful: 231 },
  { id: "KB-007", title: "Scholarship application process", category: "Finance", content: "Scholarship applications open in January each year. Submit your application through the Finance portal with academic transcripts, personal statement, and any supporting documents. Results are typically announced within 6–8 weeks.", tags: ["scholarship", "financial aid", "application"], views: 456, helpful: 389 },
  { id: "KB-008", title: "Exam timetable and clashes", category: "Academic", content: "Exam timetables are published 4 weeks before the exam period. If you have a clash (two exams at the same time), submit an enquiry immediately. The Academic Registry will arrange an alternative sitting.", tags: ["exam", "timetable", "clash", "schedule"], views: 678, helpful: 612 },
];

export const NOTIFICATIONS: Notification[] = [
  { notificationId: "N-001", userId: "STU-001", message: "Your enquiry ENQ-1042 has been assigned to Dr. Sarah Webb", isRead: false, dateSent: formatDate(-7), link: "/enquiries/ENQ-1042", type: "info" },
  { notificationId: "N-002", userId: "STU-001", message: "New reply on ENQ-1042 from Dr. Sarah Webb", isRead: false, dateSent: formatDate(-2), link: "/enquiries/ENQ-1042", type: "info" },
  { notificationId: "N-003", userId: "STU-001", message: "Upcoming appointment tomorrow at 2:00 PM", isRead: false, dateSent: formatDate(1), link: "/appointments", type: "warning" },
  { notificationId: "N-004", userId: "STU-001", message: "ENQ-1041 has been resolved. Please provide feedback.", isRead: true, dateSent: formatDate(-9), link: "/feedback/ENQ-1041", type: "success" },
  { notificationId: "N-005", userId: "STU-001", message: "ENQ-1040 needs your attention — awaiting your response", isRead: false, dateSent: formatDate(-11), link: "/enquiries/ENQ-1040", type: "error" },
];

// --- KPI DATA (for Manager dashboard) ---
export const KPI_DATA = {
  monthlyEnquiries: [
    { month: "Oct", count: 45, resolved: 38 },
    { month: "Nov", count: 52, resolved: 44 },
    { month: "Dec", count: 38, resolved: 35 },
    { month: "Jan", count: 61, resolved: 49 },
    { month: "Feb", count: 58, resolved: 51 },
    { month: "Mar", count: 47, resolved: 40 },
  ],
  categoryBreakdown: [
    { category: "Academic", count: 32, color: "#3b82f6" },
    { category: "Finance", count: 24, color: "#f59e0b" },
    { category: "Facilities", count: 18, color: "#10b981" },
    { category: "IT Support", count: 15, color: "#8b5cf6" },
    { category: "Wellbeing", count: 12, color: "#ec4899" },
    { category: "Admissions", count: 8, color: "#06b6d4" },
  ],
  avgResolutionDays: 2.4,
  aiAutomationRate: 34,
  satisfactionScore: 4.6,
  staffPerformance: [
    { name: "Dr. Sarah Webb", resolved: 28, avgDays: 1.8, rating: 4.8 },
    { name: "Karen Osei", resolved: 22, avgDays: 2.1, rating: 4.5 },
    { name: "James Park", resolved: 19, avgDays: 2.8, rating: 4.3 },
    { name: "Lisa Chen", resolved: 31, avgDays: 1.2, rating: 4.9 },
    { name: "Amelia Stone", resolved: 15, avgDays: 3.1, rating: 4.7 },
  ],
};
