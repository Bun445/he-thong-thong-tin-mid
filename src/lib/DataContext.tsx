import React, { createContext, useContext, useState } from "react";
import {
  ENQUIRIES,
  CHAT_LOGS,
  FEEDBACKS,
  NOTIFICATIONS,
  APPOINTMENTS,
  STAFF_MEMBERS,
  Enquiry,
  ChatLog,
  Feedback,
  Notification,
  Appointment,
  EnquiryStatus,
  EnquiryCategory,
  EnquiryHistory,
  ENQUIRY_HISTORY,
} from "./data";

interface DataContextType {
  enquiries: Enquiry[];
  chatLogs: ChatLog[];
  feedbacks: Feedback[];
  notifications: Notification[];
  appointments: Appointment[];
  enquiryHistory: EnquiryHistory[];
  addEnquiry: (enq: Omit<Enquiry, "id" | "aiConfidenceScore" | "status" | "dateReceived">) => string;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, note?: string, changedBy?: string) => void;
  deleteEnquiry: (id: string) => void;
  addChatLog: (log: Omit<ChatLog, "chatId" | "timestamp">) => void;
  addFeedback: (fb: Omit<Feedback, "feedbackId" | "dateSubmitted">) => void;
  markNotificationRead: (id: string) => void;
  getStaffName: (staffId?: string) => string;
  assignEnquiry: (id: string, staffId: string, changedBy?: string) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;
  cancelAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  addAppointment: (appt: Omit<Appointment, "id" | "status">) => void;
  deleteAppointment: (id: string) => void;
  stats: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(ENQUIRIES);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>(CHAT_LOGS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(FEEDBACKS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [enquiryHistory, setEnquiryHistory] = useState<EnquiryHistory[]>(ENQUIRY_HISTORY);

  const getStaffName = (staffId?: string) => {
    if (!staffId) return "Unassigned";
    const staff = STAFF_MEMBERS.find((s) => s.staffId === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : staffId;
  };

  const getNow = () => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getNowTime = () => {
    const d = new Date();
    return `${getNow()} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  };

  const addEnquiry = (enq: Omit<Enquiry, "id" | "aiConfidenceScore" | "status" | "dateReceived">) => {
    const id = `ENQ-${1043 + enquiries.length}`;
    const score = Math.floor(Math.random() * 30 + 70) / 100; // 0.70 to 1.00
    const aiTriaged = score > 0.85; // Mock AI triage 
    
    const newEnquiry: Enquiry = {
      ...enq,
      id,
      status: aiTriaged ? "AI Triaged" : "New",
      dateReceived: getNow(),
      aiConfidenceScore: score,
      aiSuggestedCategory: enq.category, // Just mock
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Log initial history
    setEnquiryHistory((prev) => [
      {
        historyId: `H-${Date.now()}`,
        enquiryId: id,
        oldStatus: "",
        newStatus: newEnquiry.status,
        changedBy: "System",
        changeDate: getNowTime(),
        note: `Enquiry submitted and ${aiTriaged ? "auto-triaged by AI" : "logged"}.`,
      },
      ...prev,
    ]);

    // Auto System/AI message
    const sysMsg: ChatLog = {
      chatId: `C-${Date.now()}`,
      studentId: enq.studentId,
      enquiryId: id,
      sender: "system",
      message: `Your enquiry has been received and ${aiTriaged ? "auto-classified" : "logged"}.`,
      timestamp: getNowTime(),
    };
    setChatLogs((prev) => [...prev, sysMsg]);

    if (aiTriaged) {
      setTimeout(() => {
        const aiMsg: ChatLog = {
          chatId: `C-${Date.now() + 1}`,
          studentId: enq.studentId,
          enquiryId: id,
          sender: "ai",
          senderName: "UniLink AI",
          message: `I've analyzed your enquiry. Based on the "${enq.category}" category, I have suggested a priority of ${enq.priority}.`,
          timestamp: getNowTime(),
        };
        setChatLogs((prev) => [...prev, aiMsg]);
      }, 1000);
    }
    
    return id;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, note?: string, changedBy: string = "Staff") => {
    let oldStatus: EnquiryStatus | "" = "";
    let statusChanged = false;
    let studentIdForNotification: string | undefined;
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          if (e.status === status) return e;
          oldStatus = e.status;
          statusChanged = true;
          studentIdForNotification = e.studentId;
          const updated = { ...e, status, dateProcessed: getNow() };
          if (status === "Resolved") updated.staffProcessed = updated.staffProcessed || "Manager";
          return updated;
        }
        return e;
      })
    );

    if (!statusChanged) return;

    // Log history
    setEnquiryHistory((prev) => [
      {
        historyId: `H-${Date.now()}`,
        enquiryId: id,
        oldStatus,
        newStatus: status,
        changedBy,
        changeDate: getNowTime(),
        note: note || `Status changed to ${status}`,
      },
      ...prev,
    ]);

    // If resolved, auto push notification for feedback
    if (status === "Resolved") {
      setNotifications((prev) => [
        {
          notificationId: `N-${Date.now()}`,
          userId: studentIdForNotification || "STU-001",
          message: `${id} has been resolved. Please provide feedback.`,
          isRead: false,
          dateSent: getNow(),
          link: `/feedback/${id}`,
          type: "success",
        },
        ...prev,
      ]);
    }
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    // Optionally clean up chat logs, but keeping them logic is fine too
  };

  const assignEnquiry = (id: string, staffId: string, changedBy: string = "Admin") => {
    const staffName = getStaffName(staffId);
    let oldStatus: EnquiryStatus | "" = "";
    let newStatus: EnquiryStatus = "In Progress";
    let assignmentApplied = false;

    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (e.staffId && e.staffId !== staffId && e.status !== "Escalated") {
          return e;
        }
        oldStatus = e.status;
        newStatus = e.status === "New" || e.status === "AI Triaged" ? "In Progress" : e.status;
        assignmentApplied = true;
        return {
          ...e,
          staffId,
          staffProcessed: staffName,
          status: newStatus,
          dateProcessed: getNow(),
        };
      })
    );

    if (!assignmentApplied) return;

    setEnquiryHistory((prev) => [
      {
        historyId: `H-${Date.now()}`,
        enquiryId: id,
        oldStatus,
        newStatus,
        changedBy,
        changeDate: getNowTime(),
        note: `Assigned to ${staffName}`,
      },
      ...prev,
    ]);
  };

  const addChatLog = (log: Omit<ChatLog, "chatId" | "timestamp">) => {
    const newLog: ChatLog = {
      ...log,
      chatId: `C-${Date.now()}`,
      timestamp: getNowTime(),
    };
    setChatLogs((prev) => [...prev, newLog]);

    // Auto-update status to In Progress if staff replies
    if (log.enquiryId && (log.sender === "staff" || log.sender === "ai")) {
      const enquiry = enquiries.find((e) => e.id === log.enquiryId);
      if (enquiry && (enquiry.status === "New" || enquiry.status === "AI Triaged")) {
        updateEnquiryStatus(
          log.enquiryId, 
          "In Progress", 
          `Auto-updated to In Progress following response from ${log.sender === "ai" ? "UniLink AI" : "Staff"}`,
          log.sender === "ai" ? "System" : "Staff"
        );
      }
    }
  };

  const addFeedback = (fb: Omit<Feedback, "feedbackId" | "dateSubmitted">) => {
    const newFb: Feedback = {
      ...fb,
      feedbackId: `FB-${Date.now()}`,
      dateSubmitted: getNow(),
    };
    setFeedbacks((prev) => [newFb, ...prev]);
    // Optionally mark enquiry as Closed
    updateEnquiryStatus(fb.enquiryId, "Closed");
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    );
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date: newDate, time: newTime } : a))
    );
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
    );
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              managerApproved: status === "Upcoming" ? true : a.managerApproved,
            }
          : a
      )
    );
  };

  const addAppointment = (appt: Omit<Appointment, "id" | "status">) => {
    const newAppt: Appointment = {
      ...appt,
      id: `APT-${Date.now()}`,
      status: "Upcoming",
    };
    setAppointments((prev) => [...prev, newAppt]);
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const stats = {
    totalEnquiries: enquiries.length,
    newCount: enquiries.filter((e) => e.status === "New").length,
    aiTriaged: enquiries.filter((e) => e.status === "AI Triaged").length,
    inProgress: enquiries.filter((e) => e.status === "In Progress").length,
    escalated: enquiries.filter((e) => e.status === "Escalated").length,
    resolved: enquiries.filter((e) => e.status === "Resolved" || e.status === "Closed").length,
    pending: enquiries.filter((e) => e.status === "New" || e.status === "AI Triaged").length,
    upcomingAppointments: appointments.filter((a) => a.status === "Upcoming").length,
    resolutionRate: enquiries.length ? Math.round((enquiries.filter((e) => e.status === "Resolved" || e.status === "Closed").length / enquiries.length) * 100) : 0,
    avgAiConfidence: enquiries.length ? Math.round((enquiries.reduce((sum, e) => sum + e.aiConfidenceScore, 0) / enquiries.length) * 100) : 0,
    feedbackAvg: feedbacks.length ? +(feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / feedbacks.length).toFixed(1) : 0,
    unreadNotifications: notifications.filter((n) => !n.isRead).length,
  };

  return (
    <DataContext.Provider
      value={{
        enquiries,
        chatLogs,
        feedbacks,
        notifications,
        appointments,
        enquiryHistory,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        addChatLog,
        addFeedback,
        markNotificationRead,
        getStaffName,
        assignEnquiry,
        rescheduleAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        addAppointment,
        deleteAppointment,
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
