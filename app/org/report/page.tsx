"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCandidateStore } from "@/components/stores/candidate-store";
import Button from "@/components/ui/button/button";
import { FiChevronLeft, FiCheckCircle } from "react-icons/fi";
import Table from "@/components/ui/table/table";
import Card from "@/components/ui/card/card";

const dummyReportData = {
  user_id: "user-123",
  course_id: "course-abc",
  generated_at: new Date().toISOString(),
  age: 30,
  gender: "Male",
  scales: [
    {
      quiz_id: "quiz-1",
      scale_name: "Openness",
      score: 85,
      interpretation: "High",
      description:
        "This scale measures your openness to new experiences. People who score high on this scale are typically imaginative, curious, and open-minded.",
      norm_thresholds: { low_max: 40, avg_min: 41, avg_max: 60, high_min: 61 },
      interpretations: {
        high: "You are highly open to new experiences, demonstrating a strong sense of curiosity and creativity.",
        average:
          "You have a balanced approach to new experiences, being open but also valuing the familiar.",
        low: "You tend to be more conventional and prefer familiar routines over new experiences.",
      },
    },
    {
      quiz_id: "quiz-2",
      scale_name: "Conscientiousness",
      score: 72,
      interpretation: "High",
      description:
        "This scale assesses your level of organization, discipline, and goal-directed behavior.",
      norm_thresholds: { low_max: 40, avg_min: 41, avg_max: 60, high_min: 61 },
      interpretations: {
        high: "You are a very diligent and organized individual, with a strong ability to plan and execute tasks.",
        average:
          "You are moderately conscientious, balancing spontaneity with a good sense of responsibility.",
        low: "You are more spontaneous and less structured in your approach to tasks and goals.",
      },
    },
    {
      quiz_id: "quiz-3",
      scale_name: "Extraversion",
      score: 55,
      interpretation: "Average",
      description:
        "This scale measures your level of sociability, assertiveness, and emotional expression.",
      norm_thresholds: { low_max: 40, avg_min: 41, avg_max: 60, high_min: 61 },
      interpretations: {
        high: "You are highly extraverted, enjoying social gatherings and drawing energy from being with others.",
        average:
          "You are an ambivert, enjoying social interaction but also valuing your alone time.",
        low: "You are more introverted, preferring quieter settings and smaller groups of people.",
      },
    },
  ],
};

const dummyAssessments = [
  {
    _id: "course-abc",
    title: "Big Five Personality Assessment",
    description: "An assessment of the five major personality traits.",
    image: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

type QuizValue = { quizName: string; value: number };

type CourseQuizData = {
  courseId: string;
  courseTitle: string;
  quizGroups: {
    [groupName: string]: QuizValue[] | { [category: string]: QuizValue[] };
  };
};

const organizationalOverviewDataByCourse: CourseQuizData[] = [
  {
    courseId: "course-abc",
    courseTitle: "Big Five Personality Assessment",
    quizGroups: {
      Personality: [
        { quizName: "Openness", value: 56 },
        { quizName: "Conscientiousness", value: 73 },
        { quizName: "Extraversion", value: 60 },
        { quizName: "Agreeableness", value: 83 },
        { quizName: "Emotional Stability", value: 67 },
      ],
    },
  },
  {
    courseId: "course-def",
    courseTitle: "Employee Wellness Survey",
    quizGroups: {
      Wellness: {
        "Emotional Wellness": [
          { quizName: "Stress and Burnout", value: 42 },
          { quizName: "Resilience", value: 66 },
        ],
        Mood: [
          { quizName: "Anxiety", value: 36 },
          { quizName: "Depression", value: 25 },
        ],
      },
    },
  },
];

const CorporateReportPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  // const token = useAuthStore((s) => s.token);
  // const { getCourseReport, assessments } = useCandidateStore();
  // const reports = useCandidateStore((s) => s.reports);

  // const reportData = reports[courseId as string];
  const reportData = dummyReportData;
  const assessments = dummyAssessments;

  // useEffect(() => {
  //   if (token) {
  //     getCourseReport(token, courseId as string);
  //   }
  // }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-24 sm:p-8 lg:p-20">
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
            Organisational Overview
          </h1>
        </div>
        {organizationalOverviewDataByCourse.map((courseData) => (
          <div
            key={courseData.courseId}
            className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl mt-8"
          >
            <h2 className="text-3xl font-bold">{courseData.courseTitle}</h2>
            {Object.entries(courseData.quizGroups).map(
              ([groupName, quizzes]) => (
                <div key={groupName} className="mt-8">
                  <h3 className="text-2xl font-semibold">{groupName}</h3>
                  {Array.isArray(quizzes) ? (
                    <div className="mt-4 space-y-4">
                      {quizzes.map((item) => (
                        <div
                          key={item.quizName}
                          className="flex items-center gap-4"
                        >
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-sky-900 h-2 rounded-full"
                                style={{ width: `${item.value}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-16 text-left font-semibold">
                            {item.value}%
                          </div>
                          <div className="w-48">{item.quizName}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    Object.entries(quizzes).map(([category, items]) => (
                      <div key={category} className="mt-4">
                        <h4 className="text-xl font-medium text-gray-600">
                          {category}
                        </h4>
                        <div className="mt-4 space-y-4">
                          {items.map((item) => (
                            <div
                              key={item.quizName}
                              className="flex items-center gap-4"
                            >
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-sky-900 h-2 rounded-full"
                                    style={{ width: `${item.value}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-16 text-left font-semibold">
                                {item.value}%
                              </div>
                              <div className="w-48">{item.quizName}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )
            )}
          </div>
        ))}
        <div className="text-center mt-16">
          <h1 className="text-4xl sm:text-5xl font-bold mt-2">
            {assessments.find((a) => a._id === courseId)?.title ||
              "Assessment Title"}
          </h1>
        </div>
        {/* Report Content Area with Animation */}'
        <Card className="p-5 bg-white">
          <div className="my-8">
            <Table headings={["Scale", "Score", "Interpretation"]}>
              {dummyReportData.scales.map((scale) => (
                <tr key={scale.quiz_id}>
                  <td className="py-4 px-6">{scale.scale_name}</td>
                  <td className="py-4 px-6">{scale.score}</td>
                  <td className="py-4 px-6">{scale.interpretation}</td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>
        <AnimatePresence>
          {reportData?.scales.map((scale) => (
            <motion.div
              key={scale.scale_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl mt-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold">{scale.scale_name}</h2>
                <p className="mt-2 text-base max-w-3xl mx-auto opacity-70">
                  {scale.description}
                </p>
                <div className="mt-8">
                  <p className="text-sm font-semibold opacity-70">Your Score</p>
                  <p className="text-5xl font-bold mt-2">{scale.score}</p>
                </div>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(scale.interpretations).map(([key, value]) => {
                  const isHighlighted =
                    key.toLowerCase() === scale.interpretation.toLowerCase();
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
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!reportData && (
          <p className="text-center py-20">Loading your report...</p>
        )}
      </main>
    </div>
  );
};

export default CorporateReportPage;
