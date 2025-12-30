"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrgStore } from "@/components/stores/org-store";
import { useAuthStore } from "@/components/stores/auth-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Table from "@/components/ui/table/table";
import { FaEye } from "react-icons/fa6";
import { FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";

interface ReportEntry {
  _id: string;
  yourScore: number;
  chapterDetails?: {
    _id: string;
    course_id: string;
    title: string;
    courseTitle?: string;
    description: string;
    chapter_order: number;
    image: string | null;
    norm_id: number;
    created_at: string;
    updated_at: string;
    corporate: boolean;
  };
  report: {
    _id: string;
    normId: number;
    scale_name: string;
    description: string;
    norm_thresholds: {
      low_max: number;
      avg_min: number;
      avg_max: number;
      high_min: number;
    };
    interpretations: {
      high: string;
      average: string;
      low: string;
    };
    corporate: boolean;
  };
}

interface CourseReport {
  courseId: string;
  courseName: string;
  chaptersCount: number;
  reportsCount: number;
  completionRate: number;
  lastUpdated: string;
  reports: ReportEntry[];
}

const ReportsListingPage = () => {
  const router = useRouter();
  const { token, metadata } = useAuthStore();
  const { getReports } = useOrgStore();
  const reports = useOrgStore(s => s.reports);
  const assignedCourses = useOrgStore(s => s.assignedCourses);
  const fetchAssignedCourses = useOrgStore(s => s.getAssignedCourses);

  useEffect(() => {
    if (token && metadata?.organization_id) {
      getReports(metadata.organization_id, token);
      if (assignedCourses.length === 0) {
        fetchAssignedCourses(metadata.organization_id);
      }
    }
  }, [token, metadata?.organization_id]);

  // Group reports by course (SAFE)
  const courseReports: CourseReport[] = React.useMemo(() => {
    if (!reports || reports.length === 0) return [];

    const coursesMap = new Map<string, CourseReport>();

    reports.forEach((report: ReportEntry) => {
      // ✅ ONLY SAFETY CHECK (NO UI CHANGE)
      if (!report.chapterDetails?.course_id) return;

      const courseId = report.chapterDetails.course_id;
      const courseMeta = assignedCourses.find(c => c._id === courseId);
      const courseName =
        report.chapterDetails.courseTitle ||
        courseMeta?.title ||
        courseId;

      if (!coursesMap.has(courseId)) {
        coursesMap.set(courseId, {
          courseId,
          courseName,
          chaptersCount: 0,
          reportsCount: 0,
          completionRate: 0,
          lastUpdated: report.chapterDetails.updated_at,
          reports: [],
        });
      }

      const course = coursesMap.get(courseId)!;

      if (
        !course.reports.some(
          r => r.chapterDetails?._id === report.chapterDetails!._id
        )
      ) {
        course.reports.push(report);
        course.reportsCount++;
        course.chaptersCount = course.reports.length;
      }

      if (
        new Date(report.chapterDetails.updated_at) >
        new Date(course.lastUpdated)
      ) {
        course.lastUpdated = report.chapterDetails.updated_at;
      }
    });

    return Array.from(coursesMap.values()).sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() -
        new Date(a.lastUpdated).getTime()
    );
  }, [reports, assignedCourses]);

  const handleViewReport = (courseId: string) => {
    router.push(`/org/reports/${courseId}`);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-24 lg:px-10 lg:py-24">
      <main className="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <p className="uppercase text-sm font-semibold tracking-wider opacity-60">
            Assessment Reports
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-2 px-4">
            Course Reports
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base max-w-3xl mx-auto opacity-70 px-4">
            View detailed assessment reports for each course assigned to your organization
          </p>
        </div>

        {/* Reports Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            {courseReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chapters
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseReports.map((course, index) => (
                      <motion.tr
                        key={course.courseId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-primary/10 rounded-lg mr-3">
                              <FiBookOpen className="text-primary text-sm" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {course.courseName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Course ID: {course.courseId.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.chaptersCount}
                          </div>
                          <div className="text-sm text-gray-500">
                            chapters
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(course.lastUpdated)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleViewReport(course.courseId)
                            }
                            className="flex items-center gap-2"
                          >
                            <FaEye className="text-sm" />
                            <span className="hidden sm:inline">
                              View Report
                            </span>
                            <span className="sm:hidden">View</span>
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiBookOpen className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No Reports Available
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                  No assessment reports have been generated yet. Reports will appear here once employees complete their assessments.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ReportsListingPage;
