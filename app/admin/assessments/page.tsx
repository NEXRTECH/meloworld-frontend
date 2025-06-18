"use client";

import AssessmentDropdownRow from "@/components/panels/admin/assessments/assessment-dropdown-row";
import { useAdminStore } from "@/components/stores/admin-store";
import { useAuthStore } from "@/components/stores/auth-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import Table from "@/components/ui/table/table";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaFilter, FaPlus, FaSort } from "react-icons/fa6";

const AssessmentsHome: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const assessments = useAdminStore((s) => s.assessments);
  const { getAssessments } = useAdminStore();
  useEffect(() => {
    if (token) getAssessments(token);
  }, []);

  return (
    <div className="dashboard-panel">
      <h1>Assessments</h1>

      <Card className="flex flex-col gap-10 w-full h-full p-10 bg-white/60">
        <div className="flex w-full justify-between items-center">
          <Input
            inputSize="sm"
            textSize="xs"
            placeholder="Search Assessments"
            icon={<FaSearch />}
          />
          <div className="flex gap-2">
          <Button variant="outline" size="xs" className="flex gap-2">
              <FaPlus />
              <p className="hidden lg:block">Create</p>
            </Button>
            <Button variant="outline" size="xs" className="flex gap-2">
              <FaSort />
              <p className="hidden lg:block">Sort</p>
            </Button>
            <Button variant="outline" size="xs" className="flex gap-2">
              <FaFilter />
              <p className="hidden lg:block">Filter</p>
            </Button>
          </div>
        </div>
        <Table headings={["Title", "Description", "Created At", "Updated At"]}>
          {assessments.map((a) => (
            <AssessmentDropdownRow
              key={a.id}
              assessmentId={a.id}
              title={a.title}
              description={a.description}
              createdAt={a.created_at}
              updatedAt={a.updated_at}
            />
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default AssessmentsHome;
