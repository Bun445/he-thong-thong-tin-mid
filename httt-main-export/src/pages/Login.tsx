import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast({ title: "Login Successful", description: "Welcome back to UniLink!" });
      navigate("/");
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    }
  };

  const autofill = (role: string) => {
    setEmail(`${role}@uni.edu.vn`);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-card border rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 text-primary">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold font-display">Sign in to UniLink</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Student Enquiry & Support System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Component</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@uni.edu.vn" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="mt-6 border-t pt-6 text-center text-sm space-y-4">
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => autofill("student")}>Student</Button>
            <Button variant="outline" size="sm" onClick={() => autofill("staff")}>Staff</Button>
            <Button variant="outline" size="sm" onClick={() => autofill("admin")}>Admin</Button>
          </div>
          <p className="text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
