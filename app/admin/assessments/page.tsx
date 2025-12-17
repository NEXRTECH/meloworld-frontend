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
import AddCourseForm from "@/components/forms/add-course";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import AddNormForm from "@/components/forms/add-norm";
import UpdateNormForm from "@/components/forms/update-norm";
import { MdRule, MdEdit } from "react-icons/md";
import Drawer from "@/components/ui/drawer/drawer";
import { CgSize } from "react-icons/cg";

/* ---------------- Animations ---------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const AssessmentsHome: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const assessments = useAdminStore((s) => s.assessments);
  const norms = useAdminStore((s) => s.norms);
  const { getAssessments, getNorms } = useAdminStore();

  const [open, setOpen] = useState(false);
  const [openNorm, setOpenNorm] = useState(false);
  const [openEditNorm, setOpenEditNorm] = useState(false);
  const [selectedNorm, setSelectedNorm] = useState<any>(null);
  const [normSearch, setNormSearch] = useState("");
  const [openCreatePopover, setOpenCreatePopover] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const [filterBy, setFilterBy] = useState<"all" | "hasDesc" | "recent">("all");
  const [openSortPopover, setOpenSortPopover] = useState(false);
  const [openFilterPopover, setOpenFilterPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    if (token) {
      getAssessments(token);
      getNorms(token);
    }
  }, [token]);

  /* ---------------- Search Filter ---------------- */
  const filteredNorms = norms.filter((norm) => {
    const q = normSearch.toLowerCase();
    return (
      norm.scale_name?.toLowerCase().includes(q) ||
      norm.gender?.toLowerCase().includes(q) ||
      norm.type?.toLowerCase().includes(q)
    );
  });

  /* ---------------- Sort & Filter ---------------- */
  const processedAssessments = [...assessments]
    .filter((a) => {
      //Search
      const matchesSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.description?.toLowerCase().includes(searchQuery.toLowerCase());

        if(!matchesSearch) return false;

      // Filter
      if(filterBy === "hasDesc") return a.description?.trim().length > 0;
      if(filterBy === "recent") {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return new Date(a.updated_at).getTime() >= sevenDaysAgo;
      }
      return true;
    })
    .sort((a,b) => {
      if(sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if(sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if(sortBy === "az") return a.title.localeCompare(b.title);
      if(sortBy === "za") return b.title.localeCompare(a.title);
      return 0;
    });
  return (
    <motion.div
      className="dashboard-panel"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants}>Assessments</motion.h1>
      <motion.p variants={itemVariants}>
        This is the central hub for managing all assessments within the platform.
      </motion.p>

      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-10 w-full h-full p-5">
          {/* ================= Top Bar ================= */}
          <div className="flex flex-col lg:flex-row w-full justify-between items-start gap-5 lg:items-center">
            <Input
              inputSize="sm"
              textSize="xs"
              placeholder="Search Assessments"
              icon={<FaSearch />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex gap-2">
              <Drawer isOpen={open} onClose={() => setOpen(false)}>
                <AddCourseForm norms={norms} onClose={() => setOpen(false)} />
              </Drawer>

              <Drawer isOpen={openNorm} onClose={() => setOpenNorm(false)}>
                <AddNormForm onClose={() => setOpenNorm(false)} />
              </Drawer>

              {/* ================= EDIT NORM DRAWER ================= */}
              <Drawer
                isOpen={openEditNorm}
                onClose={() => {
                  setOpenEditNorm(false);
                  setSelectedNorm(null);
                  setNormSearch("");
                }}
              >
                <div className="h-screen w-full max-w-xl bg-white flex flex-col">

                  {/* ---------- Header ---------- */}
                  <div className="sticky top-0 z-20 bg-white border-b px-5 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {selectedNorm ? "Edit Norm" : "Select Norm"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedNorm
                          ? "Update norm configuration"
                          : "Choose a norm to edit"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {selectedNorm && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setSelectedNorm(null)}
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setSelectedNorm(null);
                          setOpenEditNorm(false);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>

                  {/* ---------- Body ---------- */}
                  <div className="flex-1 overflow-y-auto bg-gray-50 p-4">

                    {!selectedNorm ? (
                      <>
                        {/* Search */}
                        <div className="mb-4 sticky top-0 bg-gray-50 z-10 pb-2">
                          <Input
                            placeholder="Search norms by name, gender or type..."
                            value={normSearch}
                            onChange={(e) => setNormSearch(e.target.value)}
                            inputSize="sm"
                          />
                        </div>

                        {filteredNorms.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center mt-10">
                            No norms found
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {filteredNorms.map((norm) => (
                              <div
                                key={norm._id}
                                className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition"
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold truncate">
                                    {norm.scale_name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {norm.type} • {norm.gender} • {norm.age_min}-{norm.age_max}
                                  </p>
                                </div>

                                <Button
                                  size="xs"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedNorm(norm);
                                    setNormSearch("");
                                  }}
                                >
                                  <MdEdit />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <UpdateNormForm
                        existingNorm={selectedNorm}
                        onClose={() => {
                          setSelectedNorm(null);
                          setOpenEditNorm(false);
                        }}
                      />
                    )}
                  </div>
                </div>
              </Drawer>

              {/* Create Popover */}
              <Popover open={openCreatePopover} onOpenChange={setOpenCreatePopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="xs" className="flex gap-2">
                    <FaPlus />
                    <p className="hidden lg:block">Create</p>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="xs" onClick={() => { setOpen(true); setOpenCreatePopover(false) }}>
                      <FaBook /> Course
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => { setOpenNorm(true); setOpenCreatePopover(false) }}>
                      <MdRule /> Add Norm
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => { setOpenEditNorm(true); setOpenCreatePopover(false) }}>
                      <MdEdit /> Edit Norm
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Sort Popover */}
              <Popover open={openSortPopover} onOpenChange={setOpenSortPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="xs" className="flex gap-2">
                    <FaSort />
                    <span className="hidden lg:block">Sort</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="flex flex-col gap-2">
                    <Button variant={sortBy === "newest" ? "filled" : "outline"} size="xs" onClick={ () => { setSortBy("newest"); setOpenSortPopover(false)}}>
                      Newest First
                    </Button>
                    <Button variant={sortBy === "oldest" ? "filled" : "outline"} size="xs" onClick={ () => { setSortBy("oldest"); setOpenSortPopover(false)}}>
                      Oldest First
                    </Button>
                    <Button variant={sortBy === "az" ? "filled" : "outline"} size="xs" onClick={ () => { setSortBy("az"); setOpenSortPopover(false)}}>
                      A → Z
                    </Button>
                    <Button variant={sortBy === "za" ? "filled" : "outline"} size="xs" onClick={ () => { setSortBy("za"); setOpenSortPopover}}>
                      Z → A
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover open={openFilterPopover} onOpenChange={setOpenFilterPopover}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="xs" className="flex gap-2">
                      <FaFilter />
                      <span className="hidden lg:block">Filter</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="flex flex-col gap-1">
                    <Button variant={filterBy === "all" ? "filled" : "outline"} size="xs" onClick={ () => { setFilterBy("all"); setOpenFilterPopover(false);}}> 
                      All Assessments
                    </Button>
                    <Button variant={filterBy === "hasDesc" ? "filled" : "outline"} size="xs" onClick={ () => { setFilterBy("hasDesc"); setOpenFilterPopover(false);}}>
                      Has Description
                    </Button>
                    <Button variant={filterBy === "recent" ? "filled" : "outline"} size="xs" onClick={ () => {setFilterBy("recent"); setOpenFilterPopover(false);}}>
                      Updated last 7 Days
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
            </div>
          </div>

          {/* ================= Table ================= */}
          <Table
            variants={itemVariants}
            headings={["Title", "Description", "Created At", "Updated At"]}
          >
            {processedAssessments.map((a) => (
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
