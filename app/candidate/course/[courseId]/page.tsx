"use client";
import React from "react";
import { motion } from "framer-motion";
import heroImg from "@/assets/personality.png";
import { useAuthStore } from "@/components/stores/auth-store";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/button";
import { FiChevronLeft, FiCheck } from "react-icons/fi";
import { PiPlayFill } from "react-icons/pi";
import { BsChevronCompactRight } from "react-icons/bs";
import { useCandidateStore } from "@/components/stores/candidate-store";

// Data for the traits to be displayed
const assessedTraits = [
  {
    title: "Openness",
    description: "This trait reflects the extent to which individuals are creative, adaptable, and enthusiastic about new ideas and challenges.",
  },
  {
    title: "Conscientiousness",
    description: "This trait reflects the extent to which individuals are systematic, goal-oriented, and disciplined in their approach to tasks.",
  },
  {
    title: "Extraversion",
    description: "This trait reflects the extent to which individuals derive comfort and energy from social interactions and collaboration.",
  },
  {
    title: "Agreeableness",
    description: "This trait reflects the extent to which individuals foster positive relationships and cooperate effectively with colleagues.",
  },
  {
    title: "Emotional Stability",
    description: "This trait reflects the extent to which individuals remain calm and composed in stressful work situations.",
  },
];

const CandidateCoursePage: React.FC = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const { courseId } = useParams();
  const quizQuestionsCourseDict = useCandidateStore((s) => s.quizQuestionsCourseDict);
  const assessments = useCandidateStore((s) => s.assessments);

  const courseQuizMetadataDict = useCandidateStore((s) => s.courseQuizMetadataDict);
  const submissionCourseDict = useCandidateStore((s) => s.submissionCourseDict);
  const { getQuestionsByCourseId, getSubmissionsByCourseId } = useCandidateStore();

  React.useEffect(() => {
    if (token && courseId) {
      const id = parseInt(courseId as string);
      if (!quizQuestionsCourseDict[id]) {
        getQuestionsByCourseId(token, id);
      }
      getSubmissionsByCourseId(token, id);
    }
  }, [token, courseId, getQuestionsByCourseId, getSubmissionsByCourseId, quizQuestionsCourseDict]);

  const courseIdNumber = parseInt(courseId as string);
  const totalQuizzes = quizQuestionsCourseDict[courseIdNumber]?.length ?? 0;
  const completedQuizzes = submissionCourseDict[courseIdNumber]?.length ?? 0;
  const assessment = assessments.find((assessment) => assessment.id === courseIdNumber);
  const isAssessmentComplete = totalQuizzes > 0 && totalQuizzes === completedQuizzes;
  const progressPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

  const hasStarted = progressPercentage > 0 && !isAssessmentComplete;

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-50 px-10 py-24 text-center lg:text-start lg:px-12 lg:py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button onClick={() => router.push(`/candidate`)} size="sm" variant="outline" className="flex items-center gap-2 mb-6">
        <FiChevronLeft />
        Back to Assessments
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-8 h-fit bg-secondary/40 p-8 rounded-3xl shadow-lg"
        >
          <h1 className="text-4xl lg:text-5xl font-bold">
            {assessment?.title}
          </h1>
          <p className="mt-4 text-base opacity-70">
            {assessment?.description}
          </p>

          <div className="my-8 flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                />
                <motion.path
                  className="text-primary rounded-lg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeDasharray={`${progressPercentage}, 100`}
                  initial={{ strokeDasharray: `0, 100` }}
                  animate={{ strokeDasharray: `${progressPercentage}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {progressPercentage === 100 ? (
                  <FiCheck className="w-12 h-12 text-primary" />
                ) : (
                  <>
                    <span className="text-3xl font-bold">{progressPercentage}%</span>
                    <span className="text-sm mt-1">{totalQuizzes} Questions</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              disabled={isAssessmentComplete}
              onClick={() => router.push(`/candidate/course/${courseId}/quiz`)}
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <PiPlayFill />
              {hasStarted ? "Continue Assessment" : "Start Assessment"}
            </Button>
            <Button
              disabled={!isAssessmentComplete}
              onClick={() => router.push(`/candidate/course/${courseId}/report`)}
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <BsChevronCompactRight />
              View Report
            </Button>
          </div>
        </motion.div>

        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-8">Traits Assessed</h2>
          <div className="relative pl-8 border-l-2 border-dashed border-gray-300">
            {courseQuizMetadataDict[Number(courseId)]?.map((trait, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="relative mb-12"
              >
                {/* The dot on the timeline */}
                <div className="absolute -left-[3.2rem] top-1 w-8 h-8 bg-white border-4 border-primary rounded-full"></div>

                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <h3 className="text-2xl font-bold">{trait.title}</h3>
                  <p className="mt-2 text-base opacity-70">{trait.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateCoursePage;