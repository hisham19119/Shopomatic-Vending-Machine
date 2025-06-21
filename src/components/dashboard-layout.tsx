
import { DashboardSidebar } from "./dashboard-sidebar";
import { ThemeProvider } from "./theme-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="shopomatic-theme">
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
