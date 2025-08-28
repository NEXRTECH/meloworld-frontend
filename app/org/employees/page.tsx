"use client";
import { Employee } from "@/components/panels/org/candidates-table";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import Table from "@/components/ui/table/table";
import { useAuthStore } from "@/components/stores/auth-store";
import { useOrgStore } from "@/components/stores/org-store";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaMagnifyingGlass } from "react-icons/fa6";
import { FaFemale, FaMale } from "react-icons/fa";

const OrgCandidatesPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;

  const { token, metadata } = useAuthStore();
  const { employees, getEmployees } = useOrgStore();
  const orgId = metadata?.organization_id;

  const orgType = metadata?.type;
  const isEducational = orgType === "Educational";
  const personLabel = isEducational ? "candidate" : "employee";
  const personLabelPlural = isEducational ? "candidates" : "employees";
  const personLabelCapitalized = isEducational ? "Candidate" : "Employee";
  const personLabelCapitalizedPlural = isEducational ? "Candidates" : "Employees";

  useEffect(() => {
    if (!token || !orgId) return;
    getEmployees(token, orgId).catch(console.error);
  }, [token, orgId, getEmployees]);

  const headings = ["Name", "Age", "Gender", "Created at"];

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee: any) =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort employees by created_at in ascending order (oldest first)
  const sortedEmployees = filteredEmployees.sort((a: any, b: any) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  // Calculate pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  return (
    <div className="dashboard-panel">
      <Card className="w-full bg-white/70 h-full p-5 flex flex-col gap-5">
        {/* Header section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{personLabelCapitalizedPlural} Directory</h1>
          <p className="text-sm">
            View and manage {personLabel} information from your organization.
          </p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full justify-between">
          <Input
            inputSize={"sm"}
            placeholder={`Search ${personLabelPlural}...`}
            icon={<FaMagnifyingGlass />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          {/* CSV upload functionality commented out
          <Button onClick={() => uploadRef.current?.click()} size="xs" variant="outline">
            <FaUpload /> Upload
          </Button>

          <input
            onChange={handleEmployeesSheetUpload}
            ref={uploadRef}
            accept="csv"
            type="file"
            className="hidden"
          />
          */}
        </div>

        {currentEmployees.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm mb-4">
              {searchTerm ? `No ${personLabelPlural} found matching your search.` : `No ${personLabel} data found.`}
            </p>
          </div>
        ) : (
          <Table headings={headings}>
            {currentEmployees.map((row: any) => (
              <tr key={row.id}>
                <td className="px-6 py-4 text-center">{row.name || "N/A"}</td>
                <td className="px-6 py-4 text-center">{row.age || "N/A"}</td>
                <td className="px-6 py-4 text-center">{row.gender === "male" ? <FaMale className="text-lg"/> : <FaFemale className="text-lg" />}</td>
                <td className="px-6 py-4 text-center">{row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </Table>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3">
            <div
              onClick={() => {
                if (currentPage > 1) setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
              className={`cursor-pointer p-2 rounded-full ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-900/20"
              }`}
            >
              <FaChevronLeft />
            </div>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <div
              onClick={() => {
                if (currentPage < totalPages) setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
              className={`cursor-pointer p-2 rounded-full ${
                currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-900/20"
              }`}
            >
              <FaChevronRight />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrgCandidatesPage;
