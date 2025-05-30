"use client";
import React, { useEffect, useState } from "react";
import homeImg from "@/assets/candidate-home-illustration.png";
import emotional from "@/assets/personality.png";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/stores/auth-store";
import { Assessment } from "@/components/types";
import { getAllAssessments } from "@/services/assessments";
import { PinContainer } from "@/components/ui/3d-pin";
import Card from "@/components/ui/card/card";
import Button from "@/components/ui/button/button";
import { useCandidateStore } from "@/components/stores/candidate-store";
import { get } from "http";

const CandidateHome: React.FC = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  const [courseData, setCourseData] = useState<Assessment[]>([]);
  const { getAssessments } = useCandidateStore();
  const assessments = useCandidateStore((s) => s.assessments);
  useEffect(() => {
    if (token) {
      getAssessments(token);
    }
  }, [token]);

  return (
    <div className="relative p-10 lg:py-20 lg:px-20 min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex bg-secondary/80 shadow-xl rounded-xl py-10 px-20 flex-col md:flex-row items-center justify-between gap-10 lg:gap-20">
        {/* Text Block */}
        <div className="flex-1 flex flex-col gap-5 text-center md:text-left">
          <text className="text-3xl sm:text-5xl md:text-5xl lg:text-5xl font-semibold">
            Choose an assessment
          </text>
          <p className="text-sm sm:text-base md:text-lg">
            Discover yourself through assessments tailored to your personality,
            career aptitude, and emotional intelligence.
          </p>
          <Button className="w-fit">Show assessments</Button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            className="lg:w-3/5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            src={homeImg.src}
            alt="Candidate Home"
          />
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="mt-20">
        {/* <h1>Assessments</h1> */}

        <div className="flex flex-wrap gap-6 justify-center w-full lg:px-4">
          {assessments.map((a, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="w-80 border-primary/50 max-w-md bg-gradient-to-br from-secondary/10 to-secondary rounded-xl shadow-2xl flex flex-col sm:flex-row md:flex-col items-center text-sky-900 py-3 px-2">
                <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center gap-4 w-full p-4">
                  <img
                    src={emotional.src}
                    className="w-32 object-contain"
                    alt={a.title}
                  />
                  <div className="flex flex-col gap-1 items-center sm:items-start md:items-center text-center sm:text-left md:text-center">
                    <h2 className="text-lg font-semibold">{a.title}</h2>
                    <p className="text-sm">{a.description}</p>
                    <Button
                      onClick={() => router.push(`/candidate/course/${a.id}`)}
                      className="mt-5"
                      variant="outline"
                      size="sm"
                    >
                      View More
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateHome;
