"use client";

import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { Progress } from "@/components/ui/progress/progress";
import Table from "@/components/ui/table/table";
import React, { useEffect } from "react";
import { FaDownload } from "react-icons/fa6";
import {
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiChevronLeft,
} from "react-icons/fi";
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

/* ======================= TYPES ======================= */

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
  report?: {
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

/* ======================= HELPERS ======================= */

const getScoreCategory = (score: number, thresholds: any) => {
  if (!thresholds) {
    if (score <= 10) return "low";
    if (score <= 20) return "average";
    return "high";
  }
  if (score <= thresholds.low_max) return "low";
  if (score >= thresholds.avg_min && score <= thresholds.avg_max)
    return "average";
  if (score >= thresholds.high_min) return "high";
  return "average";
};

/* ======================= ORG OVERVIEW ======================= */

const OrganizationOverview: React.FC<{
  reportsPct: ReportPctEntry[];
  reports: ReportEntry[];
}> = ({ reportsPct, reports }) => {
  const getScaleNameByChapterId = (chapterId: string) => {
    const report = reports.find(
      (r) => r.chapterDetails?._id === chapterId
    );
    return report?.report?.scale_name || "Unknown Scale";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 sm:p-6 lg:p-10 rounded-3xl shadow-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center gap-3">
          <FiTrendingUp className="text-primary" />
          Organization Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsPct.map((pct, index) => (
          <motion.div
            key={pct.chapter_id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 p-4 rounded-2xl"
          >
            <h3 className="font-bold text-center mb-2">
              {getScaleNameByChapterId(pct.chapter_id)}
            </h3>

            <div className="text-center text-primary font-bold text-xl">
              {Math.round(pct.highPercentage || 0)}%
            </div>

            <Progress value={pct.highPercentage || 0} className="mt-3" />

            <p className="text-xs text-center mt-2 opacity-70">
              <FiUsers className="inline mr-1" />
              {pct.userCount} employees
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ======================= COMPARISON CHART ======================= */

const ComparisonChart: React.FC<{ comparisons: ComparisonEntry[] }> = ({
  comparisons,
}) => {
  const data = {
    labels: comparisons.map((c) => c.chapter_name),
    datasets: [
      {
        label: "Your Organization",
        data: comparisons.map((c) => c.org_avg),
        backgroundColor: "#ff7900",
      },
      {
        label: "Industry Average",
        data: comparisons.map((c) => c.others_avg),
        backgroundColor: "#fde9da",
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-3xl shadow-xl"
    >
      <h2 className="text-center text-2xl font-bold mb-6">
        Performance Comparison
      </h2>

      <div className="h-[400px]">
        <Bar data={data} />
      </div>
    </motion.div>
  );
};

/* ======================= REPORT SECTION ======================= */

const ReportSection: React.FC<{ report: ReportEntry; index: number }> = ({
  report,
  index,
}) => {
  if (!report.report || !report.chapterDetails) return null;

  const activeCategory = getScoreCategory(
    report.yourScore,
    report.report.norm_thresholds
  );

  const recommendation =
    report.report.recommendations?.[activeCategory] ||
    report.report.recommendations?.average ||
    "No recommendation available.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-3xl shadow-xl"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {report.report.scale_name}
        </h2>
        <p className="opacity-70 mt-2">
          {report.report.description}
        </p>

        <div className="mt-6">
          <p className="text-sm opacity-70">Organization Score</p>
          <p className="text-4xl font-bold">{report.yourScore}</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h4 className="font-semibold mb-2">
          Recommendation — {activeCategory}
        </h4>
        <p className="opacity-80">{recommendation}</p>
      </div>
    </motion.div>
  );
};

/* ======================= MAIN PAGE ======================= */

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

  const reports = useOrgStore((s) => s.reports);
  const reportsPct = useOrgStore((s) => s.reportsPct);
  const comparisons = useOrgStore((s) => s.comparisons);
  const assignedCourses = useOrgStore((s) => s.assignedCourses);
  const fetchAssignedCourses = useOrgStore((s) => s.getAssignedCourses);

  const courseReports = reports.filter(
    (r) => r.chapterDetails?.course_id === courseId
  );

  const courseMeta = assignedCourses.find(
    (c) => c._id === (courseId as string)
  );

  const courseName =
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
    <div className="min-h-screen bg-gray-50 px-6 py-24">
      <main className="max-w-7xl mx-auto space-y-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/org/reports")}
          className="flex items-center gap-2"
        >
          <FiChevronLeft />
          Back to Reports
        </Button>

        <div className="text-center">
          <h1 className="text-4xl font-bold">{courseName}</h1>
          <p className="opacity-70 mt-2">
            Detailed assessment results and analysis
          </p>
        </div>

        {reportsPct.length > 0 && (
          <OrganizationOverview
            reportsPct={reportsPct}
            reports={courseReports}
          />
        )}

        {comparisons.length > 0 && (
          <ComparisonChart comparisons={comparisons} />
        )}

        <div className="space-y-8">
          {courseReports.length > 0 ? (
            courseReports.map((r, i) => (
              <ReportSection key={r._id} report={r} index={i} />
            ))
          ) : (
            <Card className="p-10 text-center">
              No reports available for this course.
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseReportsPage;
