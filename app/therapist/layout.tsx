import ProtectedRoute from "@/components/protected-route";
import React, { ReactNode } from "react";
import DashboardSidebar from "src/components/ui/sidebar";
import { GoHomeFill } from "react-icons/go";
import { PiBuildingApartmentFill, PiVirtualReality } from "react-icons/pi";
import { IoPeople, IoPerson } from "react-icons/io5";
import { FaCalendar, FaWpforms } from "react-icons/fa6";
import { BsHeadsetVr, BsVr } from "react-icons/bs";

interface TherapistLayoutProps {
  children: ReactNode;
}

export default function OrgLayout({ children }: TherapistLayoutProps) {
    const menuItems = [
        {
          title: "Dashboard",
          to: "/therapist/dashboard/",
          icon: <GoHomeFill />,
        },
        {
          title: "Sessions",
          to: "/therapist/sessions",
          icon: <FaCalendar />,
        },
        {
          title: "VR",
          to: "/therapist/vr",
          icon: <BsHeadsetVr />,
        },
        {
          title: "Patients",
          to: "/therapist/patients",
          icon: <IoPerson />,
        },
        {
          title: "Profile",
          to: "/therapist/profile",
          icon: <PiBuildingApartmentFill />,
        },
      ];
  return (
    <ProtectedRoute>
      <main className="flex h-screen w-screen">
        <DashboardSidebar title="Therapist" menuItems={menuItems}/>
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </ProtectedRoute>
  );
}
