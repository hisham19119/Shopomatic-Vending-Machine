import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeSwitcher } from "./theme-switcher";
import { cn } from "@/lib/utils";
import {
  BarChart,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/Auth-context";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Products",
    path: "/products",
    icon: Package,
  },
  {
    title: "Users",
    path: "/users",
    icon: User,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const pathname = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      // The redirect should be handled by the protected route, but this is a good fallback.
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b px-4 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-sidebar-foreground animate-fade-in"
          >
            <div className="h-8 w-8 rounded-full bg-shopoPrimary flex items-center justify-center text-white">
              <span className="font-bold">S</span>
            </div>
            <span className="text-lg">Shopomatic</span>
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"}</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={cn(
                    "flex h-9 items-center rounded-md px-3 text-sidebar-foreground transition-all animate-slide-in",
                    pathname === item.path &&
                      "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                    !isCollapsed && "justify-start",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      pathname === item.path
                        ? "text-shopoPrimary"
                        : "text-sidebar-foreground/70"
                    )}
                  />
                  {!isCollapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">{item.title}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </ScrollArea>

      <div
        className={cn(
          "flex items-center gap-2 border-t p-4 transition-all duration-300",
          isCollapsed ? "flex-col" : "justify-between"
        )}
      >
        <div
          className={cn("flex items-center gap-2", isCollapsed && "flex-col")}
        >
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="h-4 w-4 text-sidebar-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-xs font-medium text-sidebar-foreground">
                {currentUser?.name || "Admin User"}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {currentUser?.email || "admin@vendingmachine.gp"}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isCollapsed && <ThemeSwitcher />}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/70 hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "bottom"}>
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
