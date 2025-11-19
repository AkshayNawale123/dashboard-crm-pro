import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import cybaemLogo from "@/assets/cybaem-logo.png";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header with trigger and logo */}
          <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
            <SidebarTrigger />
            <img
              src={cybaemLogo}
              alt="Cybaem Tech - Beyond Limits"
              className="h-12 object-contain"
            />
          </header>
          
          {/* Main content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
