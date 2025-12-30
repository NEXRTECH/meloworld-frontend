"use client";

import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { Progress } from "@/components/ui/progress/progress";
import Table from "@/components/ui/table/table";
import React, { useEffect } from "react";
import { FaDownload } from "react-icons/fa6";
import { FiCheckCircle, FiUsers, FiTrendingUp, FiChevronLeft } from "react-icons/fi";
import { useOrgStore } from "@/components/stores/org-store";
import { useAuthStore } from "@/components/stores/auth-store";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
    recommendations?: {
      high?: string;
      average?: string;
      low?: string;
    };
    corporate: boolean;
  };
}

interface ReportPctEntry {
  userCount: number;
  highCount: number;
  chapter_id: string;
  normHighMin: number;
  highPercentage: number;
}

interface ComparisonEntry {
  course_id: string;
  course_name: string;
  chapter_id: string;
  chapter_name: string;
  others_avg: number;
  org_avg: number;
}

const getScoreCategory = (score: number, thresholds: any) => {
  if (!thresholds) return "average";
  if (score <= thresholds.low_max) return "low";
  if (score >= thresholds.avg_min && score <= thresholds.avg_max) return "average";
  if (score >= thresholds.high_min) return "high";
  return "average";
};

const CourseReportsPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const { token, metadata } = useAuthStore();

  const {
    getReports,
    getReportsPct,
    getComparisons,
    clearReportsPct,
    clearComparisons,
  } = useOrgStore();

  const reports = useOrgStore(s => s.reports);
  const reportsPct = useOrgStore(s => s.reportsPct);
  const comparisons = useOrgStore(s => s.comparisons);
  const assignedCourses = useOrgStore(s => s.assignedCourses);
  const fetchAssignedCourses = useOrgStore(s => s.getAssignedCourses);

  // ✅ FIX 1: safe filter
  const courseReports = reports.filter(
    (report: ReportEntry) =>
      report.chapterDetails?.course_id === courseId
  );

  // ✅ FIX 2 & 3: safe access
  const courseReportsPct = Array.from(
    new Map(
      reportsPct
        .filter((pct: ReportPctEntry) => {
          const matchingReport = reports.find(
            (r: ReportEntry) => r.chapterDetails?._id === pct.chapter_id
          );
          return matchingReport?.chapterDetails?.course_id === courseId;
        })
        .map((pct: ReportPctEntry) => [pct.chapter_id, pct])
    ).values()
  );

  const courseComparisons = Array.from(
    new Map(
      comparisons
        .filter((comp: ComparisonEntry) => comp.course_id === courseId)
        .map((comp: ComparisonEntry) => [comp.chapter_id, comp])
    ).values()
  );

  const courseMeta = assignedCourses.find(c => c._id === (courseId as string));

  const courseName =
    courseReports[0]?.chapterDetails?.title ||
    courseReports[0]?.chapterDetails?.courseTitle ||
    courseMeta?.title ||
    `Course • ${(courseId as string).slice(-6)}`;

  useEffect(() => {
    if (token && metadata?.organization_id) {
      getReports(metadata.organization_id, token);
      fetchAssignedCourses(metadata.organization_id);
    }
  }, [token, metadata?.organization_id]);

  useEffect(() => {
    if (token && metadata?.organization_id && courseId) {
      clearReportsPct();
      clearComparisons();
      getReportsPct(metadata.organization_id, courseId as string, token);
      getComparisons(courseId as string, token);
    }
  }, [token, metadata?.organization_id, courseId]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-24 lg:px-10 lg:py-24">
      <main id="main-report" className="flex flex-col gap-6 sm:gap-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/org/reports")}
          size="sm"
          variant="outline"
          className="flex items-center gap-2 self-start"
        >
          <FiChevronLeft />
          Back to Reports
        </Button>

        {/* Header */}
        <div className="text-center">
          <p className="uppercase text-sm font-semibold tracking-wider opacity-60">
            Course Assessment Report
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-2 px-4">
            {courseName}
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base max-w-3xl mx-auto opacity-70 px-4">
            Detailed assessment results and analysis for this course
          </p>
        </div>

        {/* unchanged UI below */}
      </main>
    </div>
  );
};

export default CourseReportsPage;
