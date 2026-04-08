import EnquiriesTable from "@/components/EnquiriesTable";
import { ListChecks } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const MyEnquiries = () => {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display">
              {currentUser?.role === "student"
                ? "My Enquiries"
                : currentUser?.role === "staff"
                ? "Teaching Queue"
                : "All Enquiries"}
            </h1>
          </div>
          <p className="mt-1 ml-12 text-muted-foreground text-sm">
            {currentUser?.role === "student"
              ? "View, track, and manage all your submitted enquiries."
              : currentUser?.role === "staff"
              ? "Handle student enquiries assigned to you and pick up unassigned cases."
              : "View, track, and manage all system enquiries."}
          </p>
        </div>
        <EnquiriesTable />
      </main>
    </div>
  );
};

export default MyEnquiries;
