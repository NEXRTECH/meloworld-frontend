"use client";
import { useAuthStore } from "@/components/stores/auth-store";
import { useOrgStore } from "@/components/stores/org-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { Progress } from "@/components/ui/progress/progress";
import Table from "@/components/ui/table/table";
import React, { useEffect, useState } from "react";

const ScalesTable = () => {
  const { token } = useAuthStore();
  const { getCourses } = useOrgStore();
  const courses = useOrgStore((s) => s.courses);
  useEffect(() => {
    if (token) getCourses(token);
  }, [token]);

  const headings = ["Scale", "Description"];

  return (
    <Card className="flex bg-white flex-col items-start gap-5 p-5 justify-start w-full h-full">
      <div className="flex w-full justify-between items-center">
        <h2>Scales</h2>
        <Button variant="outline" size="xs" className="flex gap-2 items-center">
          View More
        </Button>
      </div>
      <Table headings={headings}>
        {courses.map((row, rowIdx) => (
          <tr key={row.id || rowIdx}>
            <td>{row.title}</td>
            <td>
              <p className="text-xs">{row.description}</p>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export default ScalesTable;
