"use client";

import AssessmentDropdownRow from "@/components/panels/admin/assessments/assessment-dropdown-row";
import { useAdminStore } from "@/components/stores/admin-store";
import { useAuthStore } from "@/components/stores/auth-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import Table from "@/components/ui/table/table";
import React, { useEffect, useState } from "react";
import { FaBook, FaSearch } from "react-icons/fa";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import AddNormForm from "@/components/forms/add-norm";
import { MdRule } from "react-icons/md";
import Drawer from "@/components/ui/drawer/drawer";

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
  const [openNorm, setOpenNorm] = useState(false);

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
              <Drawer isOpen={open} onClose={() => setOpen(false)}>
                <AddCourseForm norms={norms} onClose={() => setOpen(false)} />
              </Drawer>
              <Drawer isOpen={openNorm} onClose={() => setOpenNorm(false)}>
                <AddNormForm onClose={() => setOpenNorm(false)} />
              </Drawer>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="xs" className="flex gap-2">
                    <FaPlus />
                    <p className="hidden lg:block">Create</p>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setOpen(true)}
                    >
                      <FaBook />
                      Course
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setOpenNorm(true)}
                    >
                      <MdRule />
                      Norm
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
                key={a._id}
                assessmentId={a._id}
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
