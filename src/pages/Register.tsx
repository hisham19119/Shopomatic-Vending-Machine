import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/button";
import { Label } from "@/components/ui/label";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/context/Auth-context";
import { Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "user" as "admin" | "user"  // Explicitly type as "admin" | "user"
  });

  const passwordValidation = useMemo(() => {
    const password = formData.password;
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return validations;
  }, [formData.password]);

  const passwordsMatch = useMemo(() => {
    return formData.password && formData.password === formData.passwordConfirm;
  }, [formData.password, formData.passwordConfirm]);
  
  const isFormValid = useMemo(() => {
    return Object.values(passwordValidation).every(Boolean) && passwordsMatch;
  }, [passwordValidation, passwordsMatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: "admin" | "user") => {  // Explicitly type the parameter
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please ensure the password meets all requirements and matches.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // The context now handles the error toast
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationChecklistItem = ({ text, valid }: { text: string; valid: boolean }) => (
    <div className={`flex items-center text-sm ${valid ? 'text-green-500' : 'text-muted-foreground'}`}>
      {valid ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
      {text}
    </div>
  );

  return (
    <ThemeProvider>
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
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>
              Join Shopomatic Admin Dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="animate-slide-up"
                  style={{ animationDelay: "150ms" }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="animate-slide-up"
                  style={{ animationDelay: "250ms" }}
                />
              </div>

              {formData.password && (
                <div className="grid gap-1 p-2 rounded-md bg-muted/50 animate-fade-in">
                  <ValidationChecklistItem text="At least 8 characters" valid={passwordValidation.length} />
                  <ValidationChecklistItem text="At least one uppercase letter" valid={passwordValidation.uppercase} />
                  <ValidationChecklistItem text="At least one number" valid={passwordValidation.number} />
                  <ValidationChecklistItem text="At least one special character" valid={passwordValidation.specialChar} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="animate-slide-up"
                  style={{ animationDelay: "300ms" }}
                />
                {formData.passwordConfirm && (
                  <div className="mt-1">
                    <ValidationChecklistItem text="Passwords match" valid={passwordsMatch} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full animate-slide-up"
                style={{ animationDelay: "350ms" }}
                disabled={isLoading || !isFormValid}
                primary
              >
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
              <div className="text-center text-sm animate-slide-up" style={{ animationDelay: "400ms" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-shopoPrimary hover:underline underline-animation"
                >
                  Log in
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-4 animate-slide-up" style={{ animationDelay: "450ms" }}>
                <p>© 2025 Shopomatic - Faculty of Engineering, Ain Shams University</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}
