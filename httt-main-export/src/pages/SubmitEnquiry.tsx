import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/DataContext";
import { useAuth } from "@/lib/AuthContext";
import type { EnquiryCategory, EnquiryPriority } from "@/lib/data";

const formSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must not exceed 100 characters"),
  category: z.string({ required_error: "Please select a category" }),
  priority: z.string({ required_error: "Please select a priority" }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  attachmentNote: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  "Academic",
  "Admissions",
  "Facilities",
  "Finance",
  "IT Support",
  "Wellbeing",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

const SubmitEnquiry = () => {
  const { addEnquiry } = useData();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [newId, setNewId] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      category: "",
      priority: "",
      description: "",
      attachmentNote: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const id = addEnquiry({
      studentId: currentUser?.id || "STU-001",
      subject: values.subject,
      category: values.category as EnquiryCategory,
      priority: values.priority as EnquiryPriority,
      description: values.description + (values.attachmentNote ? `\n\nNotes: ${values.attachmentNote}` : ""),
      complexity: "General",
    });
    setNewId(id);
    setSubmitted(true);
    toast({
      title: "Enquiry submitted successfully!",
      description: `Your enquiry has been assigned ID ${id}.`,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-16 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-8 ring-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Enquiry Submitted!</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Your enquiry has been received and assigned ID{" "}
                <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
                  {newId}
                </span>
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                We aim to respond within 2–3 business days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => { setSubmitted(false); form.reset(); }}
              >
                Submit Another
              </Button>
              <Button asChild>
                <Link to="/enquiries">View My Enquiries</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-display">Submit an Enquiry</h1>
            </div>
            <p className="mt-1 ml-12 text-muted-foreground text-sm">
              Fill in the form below and our team will get back to you within 2–3 business days.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-xl border bg-card shadow-sm p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input
                          id="enquiry-subject"
                          placeholder="e.g. Course transfer request, Fee payment clarification"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value.length}/100 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category & Priority in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="enquiry-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="enquiry-priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorities.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          id="enquiry-description"
                          placeholder="Please provide as much detail as possible about your enquiry…"
                          className="min-h-[140px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value.length}/1000 characters · Minimum 10 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional notes */}
                <FormField
                  control={form.control}
                  name="attachmentNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Input
                          id="enquiry-notes"
                          placeholder="Any additional context, reference numbers, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xs text-muted-foreground">* Required fields</p>
                  <Button
                    type="submit"
                    id="submit-enquiry-btn"
                    disabled={form.formState.isSubmitting}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit Enquiry
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitEnquiry;
