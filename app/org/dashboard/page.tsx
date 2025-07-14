"use client";

import React, { useState, useEffect } from "react";
import CandidatesTable from "@/components/panels/org/candidates-table";
import ScalesTable from "@/components/panels/org/scales-table";
import { useOrgStore } from "@/components/stores/org-store";
import { useAuthStore } from "@/components/stores/auth-store";

const OrgDashboardPage = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const {token} = useAuthStore();
  const {getAssignedCourses} = useOrgStore();
  const courses = useOrgStore(s => s.assignedCourses);
  useEffect(() => {
    if(token)
      getAssignedCourses(token);
  }, [token]);

  return (
    <div className="dashboard-panel overflow-y-auto p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Hey there! 👋</h1>
        <p className="mt-1 text-lg">
          Here's an overview of your activity along with some live updates.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Last updated at: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>

      {/* Candidates table section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Candidate Insights</h2>
        <p className="mb-3">
          A quick look at the number of candidates you imported recently.
        </p>
        <CandidatesTable />
      </section>

      {/* Scales table section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Scales Completion</h2>
        <p className="mb-3">
          Monitor the overall progress and completion of the scales.
        </p>
        <ScalesTable />
      </section>
    </div>
  );
};

export default OrgDashboardPage;
