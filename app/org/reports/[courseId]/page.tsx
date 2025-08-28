"use client";

import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { Progress } from "@/components/ui/progress/progress";
import Table from "@/components/ui/table/table";
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { FiCheckCircle, FiUsers, FiTrendingUp, FiChevronLeft } from "react-icons/fi";
import { useOrgStore } from "@/components/stores/org-store";
import { useAuthStore } from "@/components/stores/auth-store";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
  chapterDetails: {
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
  if (score <= thresholds.low_max) return 'low';
  if (score >= thresholds.avg_min && score <= thresholds.avg_max) return 'average';
  if (score >= thresholds.high_min) return 'high';
  return 'average'; // fallback
};

const OrganizationOverview: React.FC<{ 
  reportsPct: ReportPctEntry[]; 
  reports: ReportEntry[] 
}> = ({ reportsPct, reports }) => {
  // Create a map to get scale names from chapter IDs
  const getScaleNameByChapterId = (chapterId: string) => {
    const report = reports.find(r => r.chapterDetails._id === chapterId);
    return report?.report.scale_name || 'Unknown Scale';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white p-4 sm:p-6 lg:p-10 rounded-3xl shadow-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center gap-3">
          <FiTrendingUp className="text-primary" />
          Organization Overview
        </h2>
        {/* <p className="mt-2 text-base max-w-3xl mx-auto opacity-70">
          High-performing employee percentages across all assessment scales
        </p> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reportsPct.map((pctData, index) => {
          const scaleName = getScaleNameByChapterId(pctData.chapter_id);
          const percentage = Math.round(pctData.highPercentage || 0);
          
          return (
            <motion.div
              key={pctData.chapter_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-50 p-4 sm:p-6 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="font-bold text-base sm:text-lg">{scaleName}</h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70">
                  <FiUsers />
                  <span>{pctData.userCount} employees</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-center items-center mb-2">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{percentage}%</span>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-2 sm:h-3 bg-gray-200"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {reportsPct.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No overview data available yet</p>
        </div>
      )}
    </motion.div>
  );
};

const ComparisonChart: React.FC<{ 
  comparisons: ComparisonEntry[] 
}> = ({ comparisons }) => {
  // Prepare data for Chart.js
  const labels = comparisons.map(item => item.chapter_name);
  const orgData = comparisons.map(item => item.org_avg);
  const industryData = comparisons.map(item => item.others_avg);

  const data = {
    labels,
    datasets: [
      {
        label: 'Your Organization',
        data: orgData,
        backgroundColor: '#ff7900', // Primary color
        borderColor: '#ff7900',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Industry Average',
        data: industryData,
        backgroundColor: '#fde9da', // Secondary color
        borderColor: '#fde9da',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ff7900',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          color: '#6b7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6b7280',
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white p-4 sm:p-6 lg:p-10 rounded-3xl shadow-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center gap-3">
          <FiTrendingUp className="text-primary" />
          Performance Comparison
        </h2>
        <p className="mt-2 text-sm sm:text-base max-w-3xl mx-auto opacity-70 px-4">
          Your organization vs. industry averages across assessment areas
        </p>
      </div>

      <div className="h-96 sm:h-[500px] w-full">
        {comparisons.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No comparison data available yet</p>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      {comparisons.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.slice(0, 6).map((comparison, index) => (
            <div key={comparison.chapter_id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium truncate">
                  {comparison.chapter_name}
                </span>
                {comparison.org_avg > comparison.others_avg ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 ml-2"></div>
                ) : comparison.org_avg < comparison.others_avg ? (
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 ml-2"></div>
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0 ml-2"></div>
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-primary font-bold">{comparison.org_avg.toFixed(1)}</span>
                <span className="text-xs text-gray-600">{comparison.others_avg.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ReportSection: React.FC<{ report: ReportEntry; index: number }> = ({ report, index }) => {
  const activeCategory = getScoreCategory(report.yourScore, report.report.norm_thresholds);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
      className="bg-white p-4 sm:p-6 lg:p-10 rounded-3xl shadow-xl"
    >
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{report.report.scale_name}</h2>
        <p className="mt-2 text-sm sm:text-base max-w-3xl mx-auto opacity-70 px-4">
          {report.report.description}
        </p>
        <div className="mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm font-semibold opacity-70">Organization Score</p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">{report.yourScore}</p>
        </div>

        {/* Score Ranges */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto px-4">
          <div className={`p-2 sm:p-3 rounded-lg ${activeCategory === 'low' ? 'bg-secondary/20 border-2 border-primary' : 'bg-gray-100'}`}>
            <div className="font-medium text-xs sm:text-sm">Low</div>
            <div className="text-xs opacity-70">≤ {report.report.norm_thresholds.low_max}</div>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg ${activeCategory === 'average' ? 'bg-secondary/20 border-2 border-primary' : 'bg-gray-100'}`}>
            <div className="font-medium text-xs sm:text-sm">Average</div>
            <div className="text-xs opacity-70">{report.report.norm_thresholds.avg_min} - {report.report.norm_thresholds.avg_max}</div>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg ${activeCategory === 'high' ? 'bg-secondary/20 border-2 border-primary' : 'bg-gray-100'}`}>
            <div className="font-medium text-xs sm:text-sm">High</div>
            <div className="text-xs opacity-70">≥ {report.report.norm_thresholds.high_min}</div>
          </div>
        </div>
      </div>

      {/* Interpretations Grid */}
      <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4">
        {Object.entries(report.report.interpretations).map(
          ([key, value]) => {
            const isHighlighted = key.toLowerCase() === activeCategory;
            return (
              <motion.div
                key={key}
                animate={{
                  scale: isHighlighted ? 1 : 0.95,
                  opacity: isHighlighted ? 1 : 0.6,
                }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`p-4 sm:p-6 rounded-2xl border-2 ${
                  isHighlighted
                    ? "border-primary bg-primary/5"
                    : "bg-gray-100 border-transparent"
                }`}
              >
                <h3 className="text-base sm:text-lg font-bold capitalize flex items-center gap-2">
                  {isHighlighted && (
                    <FiCheckCircle className="text-primary flex-shrink-0" />
                  )}
                  <span className="break-words">{key} {report.report.scale_name}</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm opacity-80 leading-relaxed">{value as string}</p>
              </motion.div>
            );
          }
        )}
      </div>
    </motion.div>
  );
};

const CourseReportsPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const {token, metadata} = useAuthStore();
  const {getReports, getReportsPct, getComparisons, clearReportsPct, clearComparisons} = useOrgStore();
  const reports = useOrgStore(s => s.reports);
  const reportsPct = useOrgStore(s => s.reportsPct);
  const comparisons = useOrgStore(s => s.comparisons);
  const assignedCourses = useOrgStore(s => s.assignedCourses);
  const fetchAssignedCourses = useOrgStore(s => s.getAssignedCourses);

  // Filter data for the specific course
  const courseReports = reports.filter((report: ReportEntry) => report.chapterDetails.course_id === courseId);
  // Dedupe reportsPct by chapter_id and filter by course
  const courseReportsPct = Array.from(new Map(
    reportsPct
      .filter((pct: ReportPctEntry) => {
        const matchingReport = reports.find((report: ReportEntry) => report.chapterDetails._id === pct.chapter_id);
        return matchingReport?.chapterDetails.course_id === courseId;
      })
      .map((pct: ReportPctEntry) => [pct.chapter_id, pct])
  ).values());
  // Dedupe comparisons by chapter_id and filter by course
  const courseComparisons = Array.from(new Map(
    comparisons
      .filter((comp: ComparisonEntry) => comp.course_id === courseId)
      .map((comp: ComparisonEntry) => [comp.chapter_id, comp])
  ).values());

  // Resolve course name strictly from assignedCourses
  const courseMeta = assignedCourses.find(c => c._id === (courseId as string));
  const courseName = (courseReports[0]?.chapterDetails.courseTitle) || courseMeta?.title || (courseId as string);

  // Ensure base reports and assigned courses are loaded
  useEffect(() => {
    if(token && metadata?.organization_id) {
      getReports(metadata.organization_id, token);
      fetchAssignedCourses(metadata.organization_id);
    }
  }, [token, metadata?.organization_id]);

  // Fetch data specifically for this course (clear first to avoid duplicates)
  useEffect(() => {
    if(token && metadata?.organization_id && courseId) {
      clearReportsPct();
      clearComparisons();
      getReportsPct(metadata.organization_id, courseId as string, token);
      getComparisons(courseId as string, token);
    }
  }, [token, metadata?.organization_id, courseId]);

  // Debug data
  useEffect(() => {
    console.log("Course Reports:", courseReports);
    console.log("Course ReportsPct:", courseReportsPct);
    console.log("Course Comparisons:", courseComparisons);
  }, [courseReports, courseReportsPct, courseComparisons]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-24 lg:px-10 lg:py-24">
      <main id="main-report" className="flex flex-col gap-6 sm:gap-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/org/reports')}
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

        {/* Export Button */}
        {/* <div className="flex justify-center px-4">
          <Button className="flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
            <FaDownload className="text-sm sm:text-base" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div> */}

        {/* Organization Overview Section */}
        {courseReportsPct && courseReportsPct.length > 0 && (
          <OrganizationOverview reportsPct={courseReportsPct} reports={courseReports || []} />
        )}

        {/* Comparison Chart Section */}
        {courseComparisons && courseComparisons.length > 0 && (
          <ComparisonChart comparisons={courseComparisons} />
        )}

        {/* Report Sections */}
        <div className="space-y-6 sm:space-y-8">
          {courseReports && courseReports.length > 0 ? (
            courseReports.map((report: ReportEntry, index: number) => (
              <ReportSection key={report._id} report={report} index={index} />
            ))
          ) : (
            <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-3xl shadow-xl">
              <div className="text-center py-12 sm:py-20 px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-sky-900 mb-2">
                  No Reports Available
                </h3>
                <p className="text-sm sm:text-base text-sky-900">
                  No assessment reports found for this course.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseReportsPage;
