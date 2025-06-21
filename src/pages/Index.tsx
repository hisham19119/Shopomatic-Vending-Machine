import { useQuery } from "@tanstack/react-query";
import { BarChart, Box, Package, ShoppingBag, Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  analyticsService,
  productService,
  userService,
} from "@/services/api-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";

export default function Index() {
  const { data: analyticsData } = useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsService.getAnalyticsData,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex justify-center items-center bg-shopoPrimary/10 px-4 py-1 rounded-full animate-slide-in">
            <span className="text-sm font-medium mr-2">Shopomatic</span>
            <span className="text-xs bg-shopoPrimary text-white px-2 py-0.5 rounded-full">
              Faculty of Engineering, Ain Shams University
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className="animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {products?.length || 0}
                </div>
                <Box className="h-4 w-4 text-shopoPrimary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total products in inventory
              </p>
            </CardContent>
          </Card>

          <Card
            className="animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{users?.length || 0}</div>
                <Users className="h-4 w-4 text-shopoPrimary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active system users
              </p>
            </CardContent>
          </Card>

          <Card
            className="animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Faculty Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-medium">Graduation Project</div>
              <p className="text-xs text-muted-foreground mt-1">
                Faculty of Engineering, Ain Shams University
              </p>
            </CardContent>
          </Card>

          <Card
            className="animate-slide-up bg-shopoPrimary text-white"
            style={{ animationDelay: "400ms" }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Shopomatic Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">v1.0.0</div>
              <p className="text-xs text-white/80 mt-1">
                E-Commerce Management System
              </p>
            </CardContent>
          </Card>
        </div>

        <Card
          className="col-span-4 animate-slide-up relative overflow-hidden"
          style={{ animationDelay: "500ms" }}
        >
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Animated floating circles */}
            <svg
              width="100%"
              height="100%"
              className="absolute top-0 left-0 animate-pulse"
              style={{ opacity: 0.12 }}
            >
              <circle cx="80" cy="60" r="40" fill="#3B82F6" />
              <circle cx="90%" cy="120" r="30" fill="#3B82F6" />
              <circle cx="50%" cy="90%" r="50" fill="#3B82F6" />
            </svg>
          </div>
          <CardHeader className="z-10 relative flex flex-col items-center">
            {/* Custom SVG Vending Machine */}
            <div className="mb-4 flex justify-center">
              <svg
                width="90"
                height="120"
                viewBox="0 0 90 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg animate-fade-in"
              >
                <rect
                  x="10"
                  y="10"
                  width="70"
                  height="100"
                  rx="8"
                  fill="#2563EB"
                  stroke="#1E40AF"
                  strokeWidth="3"
                />
                <rect
                  x="20"
                  y="20"
                  width="50"
                  height="60"
                  rx="4"
                  fill="#F1F5F9"
                />
                <rect
                  x="20"
                  y="85"
                  width="50"
                  height="15"
                  rx="3"
                  fill="#1E40AF"
                />
                <rect
                  x="60"
                  y="95"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#FACC15"
                />
                <rect
                  x="25"
                  y="30"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="40"
                  y="30"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="55"
                  y="30"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="25"
                  y="45"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="40"
                  y="45"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="55"
                  y="45"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="25"
                  y="60"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="40"
                  y="60"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="55"
                  y="60"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#3B82F6"
                />
                <rect
                  x="65"
                  y="20"
                  width="5"
                  height="20"
                  rx="2"
                  fill="#FACC15"
                />
                <rect
                  x="20"
                  y="70"
                  width="50"
                  height="5"
                  rx="2"
                  fill="#CBD5E1"
                />
                <rect
                  x="30"
                  y="95"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#FACC15"
                />
                <rect
                  x="45"
                  y="95"
                  width="7"
                  height="7"
                  rx="2"
                  fill="#FACC15"
                />
              </svg>
            </div>
            <CardTitle>Welcome to Shopomatic</CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="prose max-w-none">
              <p>
                This is the administrative dashboard for the Shopomatic
                e-commerce system. Here you can manage your products, users, and
                view analytics data.
              </p>

              <ul className="mt-4 space-y-2">
                <li>
                  Navigate to the <strong>Products</strong> page to manage your
                  product inventory
                </li>
                <li>
                  The <strong>Users</strong> page allows you to manage user
                  accounts
                </li>
                <li>
                  Visit <strong>Analytics</strong> to view product and user
                  statistics
                </li>
                <li>
                  Update your preferences in the <strong>Settings</strong> page
                </li>
              </ul>

              <p className="mt-4">
                This system was developed as a graduation project for the
                Faculty of Engineering, Ain Shams University.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center items-center py-4 text-xs text-muted-foreground">
          <p>
            © 2025 Shopomatic - Faculty of Engineering, Ain Shams University.
            All Rights Reserved.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
