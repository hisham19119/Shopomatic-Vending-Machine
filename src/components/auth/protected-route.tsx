import { useAuth } from "@/context/Auth-context";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: Array<"admin" | "user">;
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // 1. If not authenticated, redirect to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If authenticated, check roles.
  const userRole = user?.role;
  if (!userRole) {
    // This case can happen briefly while user data is loading.
    // Or if the user data somehow is missing the role.
    // Redirecting to login is a safe fallback.
    return <Navigate to="/login" replace />;
  }

  // 3. If a list of allowedRoles is provided, check if the user's role is in it.
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If the role is not allowed, redirect them.
    // Admins go to their dashboard, users go to their welcome page.
    return <Navigate to={userRole === "admin" ? "/" : "/welcome"} replace />;
  }

  // 4. If all checks pass, render the child component.
  return <Outlet />;
}; 