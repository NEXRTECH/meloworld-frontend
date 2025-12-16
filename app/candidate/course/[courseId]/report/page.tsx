"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCandidateStore } from "@/components/stores/candidate-store";
import Button from "@/components/ui/button/button";
import { FiChevronLeft, FiCheckCircle } from "react-icons/fi";

/**
 * Determine category from score using thresholds.
 * thresholds should have: low_max, avg_min, avg_max, high_min
 * returns 'low' | 'average' | 'high'
 */
const getScoreCategory = (score: number | undefined, thresholds?: any) => {
  if (score == null) return "average";

  const lowMax = Number(thresholds?.low_max ?? thresholds?.lowMax ?? NaN);
  const avgMin = Number(thresholds?.avg_min ?? thresholds?.avgMin ?? NaN);
  const avgMax = Number(thresholds?.avg_max ?? thresholds?.avgMax ?? NaN);
  const highMin = Number(thresholds?.high_min ?? thresholds?.highMin ?? NaN);

  if (!isNaN(lowMax) && score <= lowMax) return "low";
  if (!isNaN(avgMin) && !isNaN(avgMax) && score >= avgMin && score <= avgMax) return "average";
  if (!isNaN(highMin) && score >= highMin) return "high";

  // sensible fallbacks if thresholds missing
  if (score <= 10) return "low";
  if (score <= 20) return "average";
  return "high";
};

const ReportPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const token = useAuthStore((s) => s.token);
  const metadata = useAuthStore((s) => (s as any).metadata);
  const { getCourseReport, assessments } = useCandidateStore();
  const reports = useCandidateStore((s) => s.reports || {});
  const [activeScaleIndex, setActiveScaleIndex] = useState(0);

  const reportData = reports[courseId as string];
  const activeScale = reportData?.scales?.[activeScaleIndex];
  console.log(reports)
  useEffect(() => {
    if (token) {
      getCourseReport(token, courseId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const activeCategory = getScoreCategory(
    activeScale?.score,
    activeScale?.norm_thresholds ?? activeScale?.report?.norm_thresholds
  );

  const chosenRecommendation =
    activeScale?.recommendation ??
    "No recommendation available.";
  // const chosenRecommendation =
  //   activeScale?.recommendation?.[activeCategory] ??
  //   activeScale?.recommendation?.average ??
  //   activeScale?.recommendation?.high ??
  //   activeScale?.recommendation?.low ??

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20 sm:px-10 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => router.push(`/candidate/course/${courseId}`)}
          size="sm"
          variant="outline"
          className="flex items-center gap-2 mb-8"
        >
          <FiChevronLeft />
          Back to Overview
        </Button>

        <main id="main-report" className="flex flex-col gap-8 mx-auto">
          <div className="text-center">
            <p className="uppercase text-sm font-semibold tracking-wider opacity-60">
              Assessment Report
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mt-2">
              {assessments.find((a) => a._id === courseId)?.title}
            </h1>
          </div>

          {/* Pill Navigation */}
          {reportData && (
            <div className="flex flex-wrap justify-center gap-2 p-3 rounded-xl bg-secondary/50">
              {reportData.scales.map((scale: any, index: number) => (
                <button
                  key={scale.scale_name + index.toString()}
                  onClick={() => setActiveScaleIndex(index)}
                  className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors ${
                    activeScaleIndex === index ? "text-white" : "hover:bg-white/50"
                  }`}
                >
                  {activeScaleIndex === index && (
                    <motion.div
                      layoutId="active-pill-background"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{scale.scale_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Report Content Area with Animation */}
          <AnimatePresence mode="wait">
            {activeScale && (
              <motion.div
                key={activeScale.scale_name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl mt-4"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold">{activeScale.scale_name}</h2>
                  <p className="mt-2 text-base max-w-3xl mx-auto opacity-70">
                    {activeScale.description}
                  </p>
                  <div className="mt-8">
                    <p className="text-sm font-semibold opacity-70">Your Score</p>
                    <p className="text-5xl font-bold mt-2">{activeScale.score}</p>
                  </div>
                </div>

                {/* Interpretations */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(activeScale.interpretations || {}).map(([key, value]) => {
                    const activeInterpretation = (activeScale.interpretation || "").toLowerCase();
                    const isHighlighted = key.toLowerCase() === activeInterpretation;
                    return (
                      <motion.div
                        key={key}
                        animate={{
                          scale: isHighlighted ? 1 : 0.95,
                          opacity: isHighlighted ? 1 : 0.6,
                        }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className={`p-6 rounded-2xl ${
                          isHighlighted ? "border-primary bg-primary/5" : "bg-gray-100 border-transparent"
                        }`}
                      >
                        <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                          {isHighlighted && <FiCheckCircle className="text-primary" />}
                          {key} Interpretation
                        </h3>
                        <p className="mt-2 text-sm opacity-80">{value}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ====== Single centered recommendation (based on score) ====== */}
                <div className="mt-8">
                  <div className="max-w-2xl mx-auto">
                    <div className="relative bg-white border rounded-2xl p-6 shadow-md text-center">
                      <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white mb-2">
                        <FiCheckCircle className="w-5 h-5" />
                      </div>

                      <h4 className="text-xl font-semibold capitalize mb-3">
                        Recommendation 
                        {/* — {activeCategory} */}
                      </h4>

                      <p className="text-base leading-relaxed text-sky-900">
                        {chosenRecommendation}
                      </p>
                    </div>
                  </div>
                </div>
                {/* ====== end single recommendation ====== */}
              </motion.div>
            )}
          </AnimatePresence>

          {!reportData && <p className="text-center py-20">Loading your report...</p>}
        </main>
      </div>
    </div>
  );
};

export default ReportPage;
