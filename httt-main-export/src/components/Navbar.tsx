import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Send,
  ListChecks,
  CalendarDays,
  BookOpen,
  BarChart3,
  BriefcaseBusiness,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useData } from "@/lib/DataContext";
import { useAuth } from "@/lib/AuthContext";

const getNavItems = (role?: string) => {
  const base = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
  ];
  
  if (role === "student") {
    base.push(
      { label: "Submit Enquiry", path: "/submit", icon: Send },
      { label: "My Enquiries", path: "/enquiries", icon: ListChecks }
    );
  } else {
    base.push(
      { label: "All Enquiries", path: "/enquiries", icon: ListChecks }
    );
  }

  base.push(
    { label: "Appointments", path: "/appointments", icon: CalendarDays },
    { label: "Knowledge Base", path: "/knowledge-base", icon: BookOpen }
  );

  if (role === "admin" || role === "staff") {
    base.push({ label: "Operations", path: "/management", icon: BriefcaseBusiness });
    base.push({ label: "KPI Dashboard", path: "/kpi", icon: BarChart3 });
  }

  return base;
};

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

const Navbar = ({ darkMode, onToggleDark }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { notifications, markNotificationRead } = useData();
  const { currentUser, logout } = useAuth();
  
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navItems = getNavItems(currentUser?.role);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">
              Uni<span className="text-info">Link</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            className="rounded-full"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem asChild key={n.notificationId}>
                      <Link
                        to={n.link || "#"}
                        onClick={() => markNotificationRead(n.notificationId)}
                        className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                      >
                        <p className={cn("text-sm", !n.isRead ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{n.dateSent}</p>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-2 h-9"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.firstName}`} />
                  <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">{currentUser?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">{currentUser?.firstName} {currentUser?.lastName}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-semibold">{currentUser?.firstName} {currentUser?.lastName}</p>
                <p className="text-xs font-normal text-muted-foreground">{currentUser?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => { logout(); navigate("/login"); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 pb-4 pt-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors my-0.5",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
