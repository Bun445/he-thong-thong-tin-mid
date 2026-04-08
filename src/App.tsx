import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import { DataProvider } from "@/lib/DataContext";
import Index from "./pages/Index.tsx";
import MyEnquiries from "./pages/MyEnquiries.tsx";
import EnquiryDetail from "./pages/EnquiryDetail.tsx";
import SubmitEnquiry from "./pages/SubmitEnquiry.tsx";
import Appointments from "./pages/Appointments.tsx";
import KnowledgeBase from "./pages/KnowledgeBase.tsx";
import KPIDashboard from "./pages/KPIDashboard.tsx";
import AdminStaffManagement from "./pages/AdminStaffManagement.tsx";
import Feedback from "./pages/Feedback.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AIChatbot from "./components/AIChatbot.tsx";
import { AuthProvider, useAuth } from "./lib/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppShell = () => {
  const { currentUser } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("unilink-theme") === "dark" ||
      (!localStorage.getItem("unilink-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("unilink-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <ScrollToTop />
      {currentUser && <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Index />} />
          <Route path="/submit" element={<SubmitEnquiry />} />
          <Route path="/enquiries" element={<MyEnquiries />} />
          <Route path="/enquiries/:id" element={<EnquiryDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/feedback/:id" element={<Feedback />} />
          
          {/* Admin only route */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
            <Route path="/management" element={<AdminStaffManagement />} />
            <Route path="/kpi" element={<KPIDashboard />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      {currentUser && <AIChatbot />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
