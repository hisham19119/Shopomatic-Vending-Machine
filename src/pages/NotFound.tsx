
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        
        <div className="text-center max-w-md px-4">
          <div className="w-full flex justify-center mb-6">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 animate-scale-in">
              <h1 className="text-5xl font-extrabold text-red-500">404</h1>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 animate-fade-in">Oops! Page not found</h2>
          <p className="text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Button asChild className="bg-shopoPrimary hover:bg-shopoPrimary/90">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">
                Go to Login
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "300ms" }}>
            <p>Shopomatic - Faculty of Engineering, Ain Shams University</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
