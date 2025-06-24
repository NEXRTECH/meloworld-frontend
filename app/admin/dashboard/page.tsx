"use client";

import React from "react";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { IoPeople, IoNotifications } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import blankProfilePic from "@/assets/blank-profile-pic.webp";

import { useAuthStore } from "@/components/stores/auth-store";
import Button from "@/components/ui/button/button";

// Assume these are your table components
import AssessmentTable from "@/components/panels/admin/home/assessment-table";
import OrganizationTable from "@/components/panels/admin/home/organizations-table";
import ReportsTable from "@/components/panels/admin/home/reports-table";
import EmailsTable from "@/components/panels/admin/home/emails-table";
import { StatCard } from "@/components/ui/card/stat-card";
import { DashboardPanel } from "@/components/ui/dashboard-panel";

const stats = [
  { title: "Organizations", stat: 19, icon: <PiBuildingApartmentFill /> },
  { title: "Total Candidates", stat: 3242, icon: <IoPeople /> },
  { title: "Assessments Completed", stat: 2567, icon: <FaWpforms /> },
  { title: "Reports Generated", stat: 1895, icon: <FaWpforms /> },
];

const AdminDashboardPage: React.FC = () => {
  const metadata = useAuthStore((state) => state.metadata);

  return (
    <div className="flex flex-col gap-8 p-10 mt-10 lg:mt-0">
      {/* --- HEADER --- */}
      <div className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back,{" "}
            <span className="text-primary">{metadata?.name}!</span>
          </h1>
          <p className="opacity-60">
            Here's an overview of your command center.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Button>
            <FiPlus className="mr-2" />
            New Assessment
          </Button>
          <button className="relative p-2 rounded-full hover:bg-gray-200 transition-colors">
            <IoNotifications className="text-xl" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
          <img
            src={blankProfilePic.src}
            className="w-12 h-12 rounded-full shadow-lg"
            alt="Admin profile picture"
          />
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, id) => (
          <StatCard
            key={id}
            title={stat.title}
            stat={stat.stat}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* --- MAIN CONTENT (Asymmetrical Layout) --- */}
      <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2">
          <AssessmentTable />
        </div>

        {/* Side Panels (using a single panel with tabs for neatness) */}
        <div className="flex flex-col gap-6">
          <OrganizationTable />
          <EmailsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
