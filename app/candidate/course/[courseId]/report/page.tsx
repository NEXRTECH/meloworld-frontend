"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCandidateStore } from "@/components/stores/candidate-store";
import Button from "@/components/ui/button/button";
import { FiChevronLeft, FiCheckCircle } from "react-icons/fi";


const ReportPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const token = useAuthStore((s) => s.token);
  const { getCourseReport, reports } = useCandidateStore();
  const [activeScaleIndex, setActiveScaleIndex] = useState(0);

  const reportData = reports[Number(courseId)];
  const activeScale = reportData?.scales[activeScaleIndex];

  useEffect(() => {
    if (token) {
      getCourseReport(token, courseId as string);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-24 sm:p-8 lg:p-24">
      <Button
        onClick={() => router.push(`/candidate/course/${courseId}`)}
        size="sm"
        variant="outline"
        className="flex items-center gap-2 mb-8"
      >
        <FiChevronLeft />
        Back to Overview
      </Button>

      <main id="main-report" className="flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="uppercase text-sm font-semibold tracking-wider opacity-60">
            Assessment Report
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            Your Personality Insights
          </h1>
        </div>

        {/* Pill Navigation */}
        {reportData && (
          <div className="flex flex-wrap justify-center gap-2 p-3 rounded-xl bg-secondary/50">
            {reportData.scales.map((scale, index) => (
              <button
                key={scale.scale_name + index.toString()}
                onClick={() => setActiveScaleIndex(index)}
                className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors ${
                  activeScaleIndex === index
                    ? "text-white"
                    : "hover:bg-white/50"
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

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(activeScale.interpretations).map(
                  ([key, value]) => {
                    const isHighlighted =
                      key.toLowerCase() ===
                      activeScale.interpretation.toLowerCase();
                    return (
                      <motion.div
                        key={key}
                        animate={{
                          scale: isHighlighted ? 1 : 0.95,
                          opacity: isHighlighted ? 1 : 0.6,
                        }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className={`p-6 rounded-2xl  ${
                          isHighlighted
                            ? "border-primary bg-primary/5"
                            : "bg-gray-100 border-transparent"
                        }`}
                      >
                        <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                          {isHighlighted && (
                            <FiCheckCircle className="text-primary" />
                          )}
                          {key} Interpretation
                        </h3>
                        <p className="mt-2 text-sm opacity-80">{value}</p>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!reportData && (
          <p className="text-center py-20">Loading your report...</p>
        )}
      </main>
    </div>
  );
};

export default ReportPage;
