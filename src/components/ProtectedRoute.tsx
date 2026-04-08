import { Navigate, Outlet } from "react-router-dom";
import { useAuth, AppRole } from "@/lib/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; // Redirect to home if they lack permission
  }

  return <Outlet />;
}
