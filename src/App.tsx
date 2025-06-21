import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/Auth-context";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import UserWelcome from "./pages/UserWelcome";
import { ThemeProvider } from "./components/theme-provider";
import { ProtectedRoute } from "./components/auth/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

// This component handles redirection for users who are already logged in
// but visit guest pages like /login or /register.
const GuestRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    // Redirect based on role
    return <Navigate to={user?.role === "admin" ? "/" : "/welcome"} replace />;
  }
  return <Outlet />; // Render child routes if not authenticated
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Routes for logged-in users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/welcome" element={<UserWelcome />} />
                  
                  {/* Admin-only routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Route>
                </Route>
    
                {/* Guest routes (for non-logged-in users) */}
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
    
                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
