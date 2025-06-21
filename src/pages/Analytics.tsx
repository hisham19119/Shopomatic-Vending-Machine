
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  ArrowDown,
  ArrowUp,
  Filter,
  Download,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsService, productService, userService } from "@/services/api-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ["#00b4e9", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("last-year");

  const { data: analytics, isLoading } = useQuery({
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
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              View detailed statistics and insights about your business
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="animate-scale-in">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-shopoPrimary data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-shopoPrimary data-[state=active]:text-white">
              Sales
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-shopoPrimary data-[state=active]:text-white">
              Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${analytics?.revenue.total.toLocaleString()}</div>
                    <div className={`flex items-center text-xs ${
                      analytics?.revenue.trend && analytics.revenue.trend > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {analytics?.revenue.trend && analytics.revenue.trend > 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {analytics?.revenue.trend}%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
                </CardContent>
              </Card>
              
              <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{analytics?.sales.total.toLocaleString()}</div>
                    <div className={`flex items-center text-xs ${
                      analytics?.sales.trend && analytics.sales.trend > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {analytics?.sales.trend && analytics.sales.trend > 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {analytics?.sales.trend}%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
                </CardContent>
              </Card>
              
              <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{users?.length}</div>
                    <div className={`flex items-center text-xs ${
                      analytics?.users.trend && analytics.users.trend > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {analytics?.users.trend && analytics.users.trend > 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {analytics?.users.trend}%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">New user growth rate</p>
                </CardContent>
              </Card>
              
              <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Product Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{products?.length}</div>
                    <div className="text-xs text-amber-500">
                      {analytics?.products.outOfStock} out of stock
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total products in inventory</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Sales distribution across products</CardDescription>
                  </div>
                  <div className="p-1 bg-primary/10 rounded-full">
                    <PieChartIcon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {analytics && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.salesByProduct}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="sales"
                          animationDuration={1500}
                        >
                          {analytics.salesByProduct.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly user growth</CardDescription>
                  </div>
                  <div className="p-1 bg-primary/10 rounded-full">
                    <LineChartIcon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {analytics && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics.userGrowth}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#00b4e9"
                          activeDot={{ r: 8 }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Sales Analysis</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {analytics && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={analytics.revenueByMonth}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#00b4e9" animationDuration={1500} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user acquisition</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {analytics && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics.userGrowth}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00b4e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00b4e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#00b4e9"
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
