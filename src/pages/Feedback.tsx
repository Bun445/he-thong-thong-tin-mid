import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, MessageSquare, AlertTriangle } from "lucide-react";
import { useData } from "@/lib/DataContext";

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= value ? "fill-warning text-warning" : "fill-muted text-muted"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const Feedback = () => {
  const { id } = useParams<{ id: string }>();
  const { enquiries, addFeedback, getStaffName } = useData();
  const enquiry = enquiries.find((e) => e.id === id);

  const [serviceRating, setServiceRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!enquiry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
          <h1 className="text-2xl font-bold font-display">Enquiry Not Found</h1>
          <p className="text-muted-foreground text-sm">Cannot submit feedback for an unknown enquiry.</p>
          <Button asChild><Link to="/enquiries">Return to Dashboard</Link></Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container max-w-md text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-8 ring-success/10 mx-auto">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">Thank You!</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Your feedback for <span className="font-mono text-foreground font-semibold">{id}</span> has been submitted successfully.
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              This helps us improve our services for all students.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to="/enquiries">Return to My Enquiries</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-display">Provide Feedback</h1>
            </div>
            <p className="mt-1 ml-12 text-muted-foreground text-sm">
              Help us improve by telling us how we did with your recent enquiry.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6 pb-6 border-b">
              <h2 className="font-semibold">{enquiry.subject}</h2>
              <p className="text-sm text-muted-foreground mt-1">ID: <span className="font-mono">{enquiry.id}</span> • Resolved by: {getStaffName(enquiry.staffId)}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFeedback({
                  enquiryId: id!,
                  studentId: "STU-001",
                  serviceRating,
                  timelinessRating,
                  overallRating,
                  comments,
                });
                setSubmitted(true);
              }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <StarRating
                  label="1. How satisfied were you with the service provided?"
                  value={serviceRating}
                  onChange={setServiceRating}
                />
                
                <StarRating
                  label="2. How would you rate the timeliness of our response?"
                  value={timelinessRating}
                  onChange={setTimelinessRating}
                />

                <StarRating
                  label="3. Overall, how would you rate your experience?"
                  value={overallRating}
                  onChange={setOverallRating}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Do you have any additional comments? (Optional)</p>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share your thoughts here..."
                  className="resize-none min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" type="button" asChild>
                  <Link to="/enquiries">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={serviceRating === 0 || timelinessRating === 0 || overallRating === 0}
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
