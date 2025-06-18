"use client";

import React, { useEffect } from "react";
import DropdownRow from "../../../ui/table/dropdown-row";
import { useAuthStore } from "../../../stores/auth-store";
import Button from "../../../ui/button/button";
import chapterImg from "@/assets/admin-login.png";
import Card from "../../../ui/card/card";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/components/stores/admin-store";

interface AssessmentDropdownRowProps {
  assessmentId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AssessmentDropdownRow: React.FC<AssessmentDropdownRowProps> = ({
  assessmentId,
  title,
  description,
  createdAt,
  updatedAt,
}) => {
  const { token } = useAuthStore();
  const router = useRouter();
  const chaptersByCourse = useAdminStore((s) => s.chaptersByCourse);
  const { getChaptersByCourse } = useAdminStore();
  useEffect(() => {
    if (token) getChaptersByCourse(token, assessmentId);
  }, [token, assessmentId]);

  return (
    <DropdownRow
      onToggle={(open) => {}}
      dropdownContent={
        <>
          {chaptersByCourse[assessmentId] &&
          chaptersByCourse[assessmentId].length > 0 ? (
            <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full justify-center">
              {chaptersByCourse[assessmentId].map((c, id) => (
                <Card
                  key={id}
                  className={`flex bg-white relative flex-col h-40 gap-2 shadow-md items-center rounded-xl border-gray-2 py-2 px-6 w-40 lg:w-full justify-center`}
                >
                  <img
                    src={chapterImg.src}
                    className="absolute w-40 opacity-20"
                  />
                  <h3 className="w-full text-center font-semibold">
                    {c.title}
                  </h3>
                  <Button
                    onClick={() =>
                      router.push(
                        `/admin/assessments/${assessmentId}/chapter/${c.id}`
                      )
                    }
                    size="xs"
                  >
                    View More
                  </Button>
                </Card>
              ))}
              <Card
                className={`flex relative bg-white flex-col h-40 gap-2 shadow-md items-center rounded-xl border-gray-2 py-2 px-6 w-40 lg:w-full justify-center`}
              >
                <h3 className="font-semibold">Add new chapter</h3>
                <Button variant="outline" size="xs">
                  Add chapter
                </Button>
              </Card>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 items-center justify-center w-full text-center">
                <p>No chapters added yet</p>
                <Button variant="outline" size="xs">
                  Add Chapters
                </Button>
              </div>
            </>
          )}
        </>
      }
      colCount={4}
    >
      <td className="font-semibold">{title}</td>
      <td>{description}</td>
      <td>
        {new Date(createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td>
        {new Date(updatedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
    </DropdownRow>
  );
};

export default AssessmentDropdownRow;
