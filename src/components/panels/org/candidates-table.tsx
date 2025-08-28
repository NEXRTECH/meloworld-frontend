"use client";
import { useAuthStore } from "@/components/stores/auth-store";
import { useOrgStore } from "@/components/stores/org-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Table from "@/components/ui/table/table";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

export interface Employee {
    id: number,
    name: string,
    age: number,
    gender: string,
    position: string
}

const OrgCandidatesTable = () => {
  const router = useRouter();
  const {token, metadata} = useAuthStore();
  const employees = useOrgStore(s => s.employees);
  const {getEmployees} = useOrgStore();
  const orgId = metadata?.organization_id;
  
  const orgType = metadata?.type;
  const isEducational = orgType === "Educational";
  const personLabel = isEducational ? "candidate" : "employee";
  const personLabelPlural = isEducational ? "candidates" : "employees";
  const personLabelCapitalized = isEducational ? "Candidate" : "Employee";
  const personLabelCapitalizedPlural = isEducational ? "Candidates" : "Employees";

  useEffect(() => {
    if(!token) return;
    getEmployees(token, orgId).then(() => console.log(employees));
  }, [token, orgId])
  

  const headings = ["Name", "Age", "Gender", "Created at"];

  return (
    <Card className="flex bg-white flex-col items-start gap-5 p-5 justify-start w-full h-full">
      <div className="flex w-full justify-between items-center">
        <h2>{personLabelCapitalizedPlural}</h2>
        <Button
          onClick={() => router.push("/org/employees")}
          variant="outline"
          size="xs"
          className="flex gap-2 items-center"
        >
          View More
          <FaArrowRight />
        </Button>
      </div>

      <Table headings={headings}>
        {employees.slice(0,5).map((row) => (
          <tr key={row.id}>
            <td className="px-6 py-4 text-center">{row.name}</td>
            <td className="px-6 py-4 text-center">{row.age}</td>
            <td className="px-6 py-4 text-center">{row.gender === "male" ? <FaMale className="text-lg"/> : <FaFemale className="text-lg" />}</td>
            <td className="px-6 py- text-center">{new Date(row.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export default OrgCandidatesTable;
