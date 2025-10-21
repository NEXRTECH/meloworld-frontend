import ProtectedRoute from "@/components/protected-route";
import React, { ReactNode } from "react";
import DashboardSidebar from "src/components/ui/sidebar";
import { GoHomeFill } from "react-icons/go";
import { PiBuildingApartmentFill, PiGear } from "react-icons/pi";
import { IoPeople } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa6";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const menuItems = [
    {
      title: "Dashboard",
      to: "/admin/dashboard/",
      icon: <GoHomeFill />,
    },
    {
      title: "Assessments",
      to: "/admin/assessments",
      icon: <FaWpforms />,
    },
    {
      title: "Organizations",
      to: "/admin/organizations",
      icon: <PiBuildingApartmentFill />,
    },
    
    {
      title: "Settings",
      to: "/admin/settings",
      icon: <PiGear />,
    },
  ];
  
  return (
    <ProtectedRoute>
      <main className="flex h-screen w-screen">
        <DashboardSidebar title="Admin" menuItems={menuItems} />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </ProtectedRoute>
  );
}
