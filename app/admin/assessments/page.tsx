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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog/dialog";
import AddCourseForm from "@/components/forms/add-course";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const AssessmentsHome: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const assessments = useAdminStore((s) => s.assessments);
  const norms = useAdminStore((s) => s.norms);
  const { getAssessments, getNorms } = useAdminStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token) {
      getAssessments(token);
      getNorms(token);
    }
  }, []);

  return (
    <motion.div
      className="dashboard-panel"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants}>Assessments</motion.h1>
      <motion.p variants={itemVariants}>
        This is the central hub for managing all assessments within the
        platform. You can create, view, and manage assessments from this
        dashboard. Use the search, sort, and filter options to navigate through
        the assessment list efficiently.
      </motion.p>

      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-10 w-full h-full p-5">
          <div className="flex flex-col lg:flex-row w-full justify-between items-start gap-5 lg:gap-0 lg:items-center">
            <Input
              inputSize="sm"
              textSize="xs"
              placeholder="Search Assessments"
              icon={<FaSearch />}
            />
            <div className="flex gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="xs" className="flex gap-2">
                    <FaPlus />
                    <p className="hidden lg:block">Create</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Create Assessment</DialogTitle>
                  <DialogDescription>
                    This form allows you to create a new assessment. Please fill
                    out the necessary details below.
                  </DialogDescription>
                  <AddCourseForm norms={norms} onClose={() => setOpen(false)} />
                </DialogContent>
              </Dialog>
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
          <Table
            variants={itemVariants}
            headings={["Title", "Description", "Created At", "Updated At"]}
          >
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
      </motion.div>
    </motion.div>
  );
};

export default AssessmentsHome;
