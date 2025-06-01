"use client";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/stores/auth-store";
import { Course } from "@/components/types";
import { getAllAssessments } from "@/services/assessments";
import Card from "@/components/ui/card/card";
import Button from "@/components/ui/button/button";
import Table from "@/components/ui/table/table";

const AssessmentTable: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Course[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!token) return setLoading(false);
      try {
        const response = await getAllAssessments(token);
        if (response.ok) {
          const data = await response.json();
          setAssessments(data.courses);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [token]);

  const headings = ["Title", "Description", "Created At", "Updated At"];

  return (
    <Card className="flex flex-col bg-white items-start gap-5 p-5 justify-start w-full h-96">
      <div className="flex w-full justify-between items-center">
        <h2>Assessments</h2>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/assessments")}
          size="xs"
          className="flex gap-2 items-center"
        >
          View More <FaArrowRight />
        </Button>
      </div>

      <Table headings={headings}>
        {loading ? (
          // show 4 skeleton rows
          Array.from({ length: 4 }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {headings.map((_, colIdx) => (
                <td
                  key={colIdx}
                  className="px-6 py-4 border-y-2 border-gray-200 text-start"
                >
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mx-auto" />
                </td>
              ))}
            </tr>
          ))
        ) : (
          // render actual data
          assessments.map((assessment) => (
            <tr key={assessment.id}>
              <td className="px-6 py-4 text-sm border-y-2 border-gray-200">
                {assessment.title}
              </td>
              <td className="px-6 py-4 text-sm border-y-2 border-gray-200">
                {assessment.description}
              </td>
              <td className="px-6 py-4 text-sm border-y-2 border-gray-200">
                {new Date(assessment.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 text-sm border-y-2 border-gray-200">
                {new Date(assessment.updated_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))
        )}
      </Table>
    </Card>
  );
};

export default AssessmentTable;
