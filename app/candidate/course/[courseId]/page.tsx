"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroImg from "@/assets/personality.png";
import { useAuthStore } from "@/components/stores/auth-store";
import { useParams, useRouter } from "next/navigation";
import { Quiz } from "@/components/types";
import { getAllQuizzesByChapter } from "@/services/quizzes";
import Card from "@/components/ui/card/card";
import Button from "@/components/ui/button/button";
import { FiChevronLeft, FiDownload } from "react-icons/fi";
import { PiPlayFill } from "react-icons/pi";
import { BsChevronBarLeft } from "react-icons/bs";

const CandidateCoursePage: React.FC = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const { courseId } = useParams();
  const [quizzesData, setQuizzesData] = useState<Quiz[]>([]);
  useEffect(() => {
    const fetchChapters = async () => {
      if (token) {
        try {
          const response = await getAllQuizzesByChapter(
            token,
            Number(courseId)
          );
          if (response?.ok) {
            const data = await response.json();
            const quizzes: Quiz[] = data.quizzes ?? [];
            setQuizzesData(quizzes);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchChapters();
  }, []);
  return (
    <motion.div
      className="relative min-h-screen w-full p-4 md:p-8 lg:p-20 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Button onClick={() => router.back()} size="xs" className="mb-5">
        <FiChevronLeft />
        Back
      </Button>
      {/* Hero Section */}
      <motion.div
        className="grid grid-cols-1 bg-secondary/80 p-10 lg:py-10 lg:px-14 shadow-lg rounded-xl md:grid-cols-2 gap-10 items-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-4 text-center md:text-left">
          <text className="text-4xl lg:text-5xl font-semibold">
            Personality Assessments
          </text>
          <p className="text-sm sm:text-base md:text-base">
            This dimension explores traits that influence workplace behavior,
            interpersonal interactions, and the ability to adapt, organize, and
            manage stress effectively.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button
              onClick={() => router.push(`/candidate/course/${courseId}/quiz`)}
              size="sm"
              className="mt-4 w-fit"
            >
              <PiPlayFill />
              Start Assessment
            </Button>
            <Button variant="outline" size="sm" className="lg:mt-4 w-fit">
              <FiDownload />
              Download Report
            </Button>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            className="w-3/5 max-w-sm md:max-w-md lg:max-w-md xl:max-w-xl"
            src={heroImg.src}
            alt="Personality Assessment"
          />
        </div>
      </motion.div>

      {/* CandidateChapters List */}
      <div className="flex flex-col p-5 lg:px-10 gap-4">
        <h1>Traits Assessed</h1>
        <section className="trait">
          <h2>Openness</h2>
          <p>
            This trait reflects the extent to which individuals are creative,
            adaptable, and enthusiastic about new ideas and challenges.
          </p>
        </section>

        <section className="trait">
          <h2>Conscientiousness</h2>
          <p>
            This trait reflects the extent to which individuals are systematic,
            goal-oriented, and disciplined in their approach to tasks.
          </p>
        </section>

        <section className="trait">
          <h2>Extraversion</h2>
          <p>
            This trait reflects the extent to which individuals derive comfort
            and energy from social interactions and collaboration.
          </p>
        </section>

        <section className="trait">
          <h2>Agreeableness</h2>
          <p>
            This trait reflects the extent to which individuals foster positive
            relationships and cooperate effectively with colleagues.
          </p>
        </section>

        <section className="trait">
          <h2>Emotional Stability</h2>
          <p>
            This trait reflects the extent to which individuals remain calm and
            composed in stressful work situations.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default CandidateCoursePage;
