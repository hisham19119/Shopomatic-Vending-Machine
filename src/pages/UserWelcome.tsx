import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Truck } from "lucide-react";
import { useAuth } from "@/context/Auth-context";
import { useNavigate } from "react-router-dom";

export default function UserWelcome() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // The protected route will handle the redirect, but an explicit one is good for clarity.
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4 animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Truck className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This section will soon house the main E-commerce website and our innovative delivery management system and tracking iot devices connected to FLESBI platform.
          </p>
          <p className="text-center text-muted-foreground mt-2">
            Stay tuned for updates!
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 