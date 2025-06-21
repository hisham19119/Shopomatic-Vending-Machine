import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/button";
import { Label } from "@/components/ui/label";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/context/Auth-context";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      
      // The user object in context is not updated immediately.
      // We'll navigate to the main page and let the Protected/Guest routes handle the final redirection.
      navigate('/'); 

    } catch (error) {
      console.error("Login failed:", error);
      // Error toast is now handled by the context/service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-shopoPrimary flex items-center justify-center text-white">
                <span className="font-bold text-xl">S</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Shopomatic Admin
            </CardTitle>
            <CardDescription>
              Faculty of Engineering, Ain Shams University
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@vendingmachine.gp"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="text-sm text-shopoPrimary hover:underline underline-animation"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="animate-slide-up"
                  style={{ animationDelay: "150ms" }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full animate-slide-up"
                style={{ animationDelay: "200ms" }}
                disabled={isLoading}
                primary
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
              <div
                className="text-center text-sm animate-slide-up"
                style={{ animationDelay: "250ms" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-shopoPrimary hover:underline underline-animation"
                >
                  Create one
                </Link>
              </div>
              <div
                className="text-center text-xs text-muted-foreground mt-4 animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                {/* <p>Demo credentials: admin@vendingmachine.gp / admin</p> */}
              </div>
            </CardFooter>
          </form>
        </Card>
    </div>
  );
}
