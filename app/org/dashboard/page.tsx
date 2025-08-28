"use client";

import React, { useState, useEffect } from "react";
import CandidatesTable from "@/components/panels/org/candidates-table";
import ScalesTable from "@/components/panels/org/scales-table";
import { useOrgStore } from "@/components/stores/org-store";
import { useAuthStore } from "@/components/stores/auth-store";
import OrgCandidatesTable from "@/components/panels/org/candidates-table";

const OrgDashboardPage = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { token, metadata } = useAuthStore();
  const { getAssignedCourses } = useOrgStore();
  const courses = useOrgStore((s) => s.assignedCourses);

  const orgType = metadata?.type;
  const isEducational = orgType === "Educational";
  const personLabel = isEducational ? "candidate" : "employee";
  const personLabelPlural = isEducational ? "candidates" : "employees";
  const personLabelCapitalized = isEducational ? "Candidate" : "Employee";
  const personLabelCapitalizedPlural = isEducational ? "Candidates" : "Employees";

  useEffect(() => {
    if (token) getAssignedCourses(token);
  }, [token]);

  return (
    <div className="dashboard-panel overflow-y-auto p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Hey there! 👋</h1>
        <p className="mt-1 text-lg">Here's an overview of your activity</p>
      </div>

      {/* Candidates/Employees table section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{personLabelCapitalizedPlural} Insights</h2>
        <p className="mb-3">
          A quick look at the number of {personLabelPlural} you imported recently.
        </p>
        <OrgCandidatesTable />
      </section>

      {/* Scales table section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Assessments Completion</h2>
        <p className="mb-3">
          Monitor the overall progress and completion of the Assessments.
        </p>
        <ScalesTable />
      </section>
    </div>
  );
};

export default OrgDashboardPage;
