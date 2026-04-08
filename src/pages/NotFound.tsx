import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
      <div className="text-center px-4 space-y-6">
        <div className="relative">
          <p className="text-[120px] font-bold font-display leading-none text-muted/60 select-none dark:text-muted/30">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold font-display text-foreground">
            Page Not Found
          </p>
        </div>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          The page <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</span> does not exist or may have been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Button asChild className="gap-2">
            <Link to="/"><HomeIcon className="h-4 w-4" /> Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
