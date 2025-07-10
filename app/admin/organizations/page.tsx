"use client";

import { useAdminStore } from "@/components/stores/admin-store";
import { useAuthStore } from "@/components/stores/auth-store";
import { Course } from "@/components/types";
import Card from "@/components/ui/card/card";
import MultiSelect from "@/components/ui/multiselect/multiselect";
import Table from "@/components/ui/table/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs/tabs";
import { getAllAssessments } from "@/services/assessments";
import { Switch } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button/button";

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

const OrganizationPanel = () => {
  const token = useAuthStore((s) => s.token);
  const [isLoadingScales, setIsLoadingScales] = useState(false);
  const [selectedScales, setSelectedScales] = useState<
    Record<number, string[]>
  >({});

  const { updateOrganization } = useAdminStore((state) => state);
  const organizations = useAdminStore(s => s.organizations)
  const courses = useAdminStore(s => s.courses)

  const handleScaleChange = (orgId: number, values: string[]) => {
  };

  const headings = [
    "Company Name",
    "Industry Type",
    "Account Approved",
    "Platform Access",
  ];

  return (
    <motion.div
      className="dashboard-panel p-4 mt-10 lg:mt-0 sm:p-6 lg:p-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        <motion.div className="flex flex-col" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Organization Management
          </h1>
          <p className="text-sm mt-1">
            Manage company profiles, approve new partners, and assign assessment
            scales.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="orgs" className="w-full">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="orgs" className="flex-1 sm:flex-none">
                Organizations
              </TabsTrigger>
              <TabsTrigger value="scales" className="flex-1 sm:flex-none">
                Assign Scales
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scales" className="mt-4">
              <Card className="p-4 sm:p-6 bg-white/60 flex flex-col gap-5">
              
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    Assign Assessments to Organizations
                  </h2>
                  <p className="text-sm mt-1">
                    Select an organization to assign or unassign psychological
                    assessment scales.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  {isLoadingScales ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading assessments...</span>
                    </div>
                  ) : (
                    <Table headings={["Company Name", "Available Assessments"]}>
                      {organizations.map((org) => (
                        <tr key={org.organization_id}>
                          <td className="w-1/3">{org.organization_name}</td>
                          <td className="w-2/3">
                            <MultiSelect
                              selected={selectedScales[org.organization_id] || []}
                              onChange={(values) =>
                                handleScaleChange(org.organization_id, values)
                              }
                              placeholder="Select Scales"
                              items={
                                courses?.map((s) => ({
                                  value: s.title.toLowerCase(),
                                  label: s.title,
                                })) || []
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="orgs" className="mt-4">
              <Card className="flex bg-white/60 flex-col items-start gap-5 p-4 sm:p-6 justify-start w-full min-h-96">
                <div className="flex w-full justify-between items-start flex-col">
                  <h2 className="text-xl font-semibold">All Organizations</h2>
                  <p className="text-sm mt-1">
                    Here you can view all registered organizations and manage
                    their platform access.
                  </p>
                </div>
                <div className="overflow-x-auto w-full">
                  <Table headings={headings}>
                    {organizations.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td>{row["organization_name"]}</td>
                        <td>{row["organization_type"]}</td>
                        <td>
                          <Switch
                            checked={row["is_approved"]}
                            onChange={(value) => {
                              updateOrganization(row.organization_id, {
                                is_approved: value,
                              });
                            }}
                            className="group flex h-7 w-14 cursor-pointer rounded-full bg-secondary p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-primary/60"
                          >
                            <span
                              aria-hidden="true"
                              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-sky-900 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                            />
                          </Switch>
                        </td>
                        <td>
                          <Switch
                            checked={row["is_enabled"]}
                            onChange={(value) => {
                              updateOrganization(row.organization_id, {
                                is_enabled: value,
                              });
                            }}
                            className="group flex h-7 w-14 cursor-pointer rounded-full bg-secondary p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-primary/60"
                          >
                            <span
                              aria-hidden="true"
                              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-sky-900 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                            />
                          </Switch>
                        </td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrganizationPanel;
