import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import RecepcionistaSidebar from "./RecepcionistaSidebar";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";

interface RecepcionistaLayoutProps {
  children?: ReactNode;
}

export default function RecepcionistaLayout({ children }: RecepcionistaLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <RecepcionistaSidebar />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-6 md:p-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
