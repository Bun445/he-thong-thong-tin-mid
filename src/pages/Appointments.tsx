import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/DataContext";
import { STAFF_MEMBERS } from "@/lib/data";
import { CalendarDays, Clock, MapPin, Video, Phone, User, Plus, Trash } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof MapPin; className: string }> = {
  "In Person": { icon: MapPin, className: "bg-info/10 text-info border-info/30" },
  Online: { icon: Video, className: "bg-success/10 text-green-700 dark:text-green-400 border-success/30" },
  Phone: { icon: Phone, className: "bg-warning/10 text-yellow-700 dark:text-yellow-400 border-warning/30" },
};

const statusConfig: Record<string, string> = {
  Upcoming: "bg-primary/10 text-primary border-primary/30",
  Completed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const Appointments = () => {
  const { appointments, getStaffName, rescheduleAppointment, cancelAppointment, addAppointment, deleteAppointment } = useData();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [rescheduleData, setRescheduleData] = useState<{ id: string; date: string; time: string } | null>(null);
  const [bookData, setBookData] = useState<{ title: string; staffId: string; department: string; date: string; time: string; type: "In Person" | "Online" | "Phone"; studentId: string; locationOrLink: string } | null>(null);

  const displayAppointments = appointments.filter((a) => {
    if (currentUser?.role === "student") return a.studentId === currentUser.id;
    if (currentUser?.role === "staff") return a.staffId === currentUser.id;
    return true; // admin sees all
  });

  const upcoming = displayAppointments.filter((a) => a.status === "Upcoming");
  const past = displayAppointments.filter((a) => a.status !== "Upcoming");

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-display">Appointments</h1>
            </div>
            <p className="mt-1 ml-12 text-muted-foreground text-sm">
              Manage your upcoming and past appointments with university staff.
            </p>
          </div>
          <Button 
            id="book-appointment-btn" 
            className="gap-2"
            onClick={() => setBookData({
               title: "Academic Advising",
               staffId: "STF-001",
               department: "Academic Support",
               date: "Tomorrow",
               time: "10:00 AM",
               type: "In Person",
               studentId: currentUser?.role === "student" ? currentUser.id : "STU-001",
               locationOrLink: "Room 402, Building A"
            })}
          >
            <Plus className="h-4 w-4" /> Book Appointment
          </Button>
        </div>

        {/* Upcoming */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold font-display flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Upcoming
            <Badge variant="secondary" className="text-xs">{upcoming.length}</Badge>
          </h2>
          {upcoming.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
              <CalendarDays className="h-10 w-10 mx-auto opacity-30 mb-3" />
              <p className="text-sm font-medium">No upcoming appointments</p>
              <p className="text-xs mt-1">Book an appointment with a member of staff.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((appt) => {
                const tc = typeConfig[appt.type];
                return (
                  <div key={appt.id} className="rounded-xl border bg-card shadow-sm p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{appt.title}</h3>
                        <p className="text-sm text-muted-foreground">{appt.department}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-xs flex-shrink-0", statusConfig[appt.status])}>
                        {appt.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{getStaffName(appt.staffId)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 flex-shrink-0" />
                        <span>{appt.date}</span>
                        <span>·</span>
                        <span className="font-medium text-foreground">{appt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <tc.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Badge variant="outline" className={cn("text-xs", tc.className)}>
                          {appt.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 border-t pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setRescheduleData({ id: appt.id, date: appt.date, time: appt.time })}>Reschedule</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => cancelAppointment(appt.id)}>Cancel</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Past */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold font-display flex items-center gap-2 text-muted-foreground">
            Past Appointments
            <Badge variant="outline" className="text-xs">{past.length}</Badge>
          </h2>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Appointment</th>
                  <th className="px-6 py-3 text-left font-medium hidden sm:table-cell">With</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium hidden md:table-cell">Type</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {past.map((appt) => {
                  const tc = typeConfig[appt.type];
                  return (
                    <tr key={appt.id} className="border-t text-sm hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium">{appt.title}</p>
                        <p className="text-xs text-muted-foreground">{appt.department}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{getStaffName(appt.staffId)}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {appt.date}<br />{appt.time}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <Badge variant="outline" className={cn("text-xs", tc.className)}>
                          {appt.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn("text-xs", statusConfig[appt.status])}>
                          {appt.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteAppointment(appt.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Dialog open={!!rescheduleData} onOpenChange={(open) => !open && setRescheduleData(null)}>
        {rescheduleData && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
              <DialogDescription>Please select a new date and time for your appointment.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Date</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Apr 10, 2026" 
                  value={rescheduleData.date} 
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Time</label>
                <Input 
                  type="text" 
                  placeholder="e.g. 10:30 AM" 
                  value={rescheduleData.time} 
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleData(null)}>Cancel</Button>
              <Button onClick={() => {
                rescheduleAppointment(rescheduleData.id, rescheduleData.date, rescheduleData.time);
                setRescheduleData(null);
              }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!bookData} onOpenChange={(open) => !open && setBookData(null)}>
        {bookData && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
              <DialogDescription>Schedule a new self-service appointment with university staff.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic / Title</label>
                <Input 
                  value={bookData.title} 
                  onChange={(e) => setBookData({ ...bookData, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Staff Member</label>
                <Select value={bookData.staffId} onValueChange={(val) => {
                  const staff = STAFF_MEMBERS.find(s => s.staffId === val);
                  setBookData({ ...bookData, staffId: val, department: staff?.specialty || bookData.department });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_MEMBERS.map((s) => (
                      <SelectItem key={s.staffId} value={s.staffId}>
                        {s.firstName} {s.lastName} — {s.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting Type</label>
                <Select value={bookData.type} onValueChange={(val) => setBookData({ ...bookData, type: val as "In Person" | "Online" | "Phone" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Person">In Person</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    placeholder="e.g. Apr 15, 2026" 
                    value={bookData.date} 
                    onChange={(e) => setBookData({ ...bookData, date: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input 
                    placeholder="e.g. 02:00 PM" 
                    value={bookData.time} 
                    onChange={(e) => setBookData({ ...bookData, time: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location / Link</label>
                <Input 
                  placeholder="e.g. Room 301, Block A or https://meet.uni.edu.vn/..." 
                  value={bookData.locationOrLink} 
                  onChange={(e) => setBookData({ ...bookData, locationOrLink: e.target.value })} 
                />
              </div>
              <p className="text-xs text-muted-foreground italic flex items-center gap-1.5 mt-2">
                <CalendarDays className="h-3 w-3" />
                Will be automatically synced with your Outlook Calendar.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookData(null)}>Cancel</Button>
              <Button onClick={() => {
                addAppointment(bookData);
                setBookData(null);
                toast({
                  title: "Appointment Booked!",
                  description: "Your appointment has been synced with your Outlook Calendar.",
                });
              }}>Book & Sync Outlook</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Appointments;
