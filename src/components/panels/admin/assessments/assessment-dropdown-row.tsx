"use client";

import React, { useEffect, useState } from "react";
import DropdownRow from "../../../ui/table/dropdown-row";
import { useAuthStore } from "../../../stores/auth-store";
import Button from "../../../ui/button/button";
import chapterImg from "@/assets/admin-login.png";
import Card from "../../../ui/card/card";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/components/stores/admin-store";
import { FaTrash } from "react-icons/fa6";
import { useToast } from "@/components/hooks/use-toast";
import AddChapterForm from "@/components/forms/add-chapter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";

interface AssessmentDropdownRowProps {
  assessmentId: string;
  title: string;
  description: string;
  corporate: boolean;
  createdAt: string;
  updatedAt: string;
}

const AssessmentDropdownRow: React.FC<AssessmentDropdownRowProps> = ({
  assessmentId,
  title,
  description,
  corporate,
  createdAt,
  updatedAt,
}) => {
  const { token } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const chaptersByCourse = useAdminStore((s) => s.chaptersByCourse);
  const norms = useAdminStore((s) => s.norms);
  const { getChaptersByCourse, deleteCourse, deleteChapter } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteChapterOpen, setDeleteChapterOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  useEffect(() => {
  if (!token) return;

  // fetch only once per course
  if (!chaptersByCourse[assessmentId]) {
    getChaptersByCourse(token, assessmentId);
  }
}, [token, assessmentId, chaptersByCourse, getChaptersByCourse]);


  const handleDeleteCourse = async () => {
    if (token) {
      deleteCourse(token, assessmentId)
        .then(() =>
          toast({
            title: "Course deleted",
            description: "The course has been deleted",
            variant: "success",
          })
        )
        .catch((err) => {
          toast({
            title: "Error",
            description: "Failed to delete course",
            variant: "error",
          });
        });
    }
  };

  const handleDeleteChapter = async () => {
    if(!token || !selectedChapterId) return;

    try {
      await deleteChapter(token, assessmentId, selectedChapterId);

      toast({
        title: "Chapter Deleted",
        description: "The Chapter has been deleted successfully",
        variant: "success",
      });

      // Refresh Chapter list
      getChaptersByCourse(token, assessmentId);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "error",
      });
    } finally {
      setDeleteChapterOpen(false);
      setSelectedChapterId(null);
    }
  }

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
                  key={c._id}
                  className="flex bg-white relative flex-col h-40 gap-2 shadow-md items-center rounded-xl border-gray-2 py-2 px-6 w-40 lg:w-full justify-center"
                >
                  <img src={chapterImg.src} className="absolute w-40 opacity-20" />

                  <h3 className="w-full text-center font-semibold">
                    {c.title}
                  </h3>

                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      onClick={() =>
                        router.push(
                          `/admin/assessments/${assessmentId}/chapter/${c._id}`
                        )
                      }
                    >
                      View More
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setSelectedChapterId(c._id); 
                        setDeleteChapterOpen(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 items-center justify-center w-full text-center">
                <p>No chapters added yet</p>
              </div>
            </>
          )}
          {/* ===== DELETE CHAPTER CONFIRMATION DIALOG ===== */}
          <Dialog open={deleteChapterOpen} onOpenChange={setDeleteChapterOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Chapter?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the chapter
                  and all its quizzes and questions.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteChapterOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteChapter}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          
          <div className="flex justify-center mt-5">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                  Add Chapter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Add Chapter</DialogTitle>
                <AddChapterForm
                  onClose={() => {
                    setOpen(false);
                  }}
                  courseId={assessmentId}
                  corporate={corporate}
                  norms={norms}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-center mt-5">
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                  <FaTrash className="text-red-300" />
                  Delete course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the course and all of its chapters and questions.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleDeleteCourse();
                      setDeleteOpen(false);
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
