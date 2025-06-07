"use client";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCandidateStore } from "@/components/stores/candidate-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Table from "@/components/ui/table/table";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FiChevronLeft } from "react-icons/fi";
const data = {
  quiz_id: 14,
  scale_name: "Openness",
  score: 14,
  interpretation: "High",
  description:
    "Openness (Curiosity) reflects the extent to which a student’s actions demonstrate creativity, inquisitiveness, flexibility, open-mindedness, and embracing diversity.",
  norm_thresholds: {
    low_max: 11,
    avg_min: 12,
    avg_max: 13,
    high_min: 14,
  },
  interpretations: {
    high: "Male students with high openness enjoy exploring unfamiliar subjects, think of new ways to solve problems, and embrace diverse perspectives in their learning.",
    average:
      "Male students with average openness sometimes explore new topics but also stick to familiar approaches. They can be creative but may not seek out novel experiences frequently.",
    low: "Male students with low openness prefer structure and routine, may stick to known methods, and might feel uncomfortable when asked to handle uncertain or unfamiliar material.",
  },
};
const ReportPage = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const token = useAuthStore((s) => s.token);
  const { getCourseReport } = useCandidateStore();
  const reports = useCandidateStore((s) => s.reports);

  useEffect(() => {
    if (token) {
      getCourseReport(token, Number(courseId));
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-20">
      <Button
        onClick={() => router.push(`/candidate/course/${courseId}`)}
        size="xs"
        className="mb-5"
      >
        <FiChevronLeft />
        Back
      </Button>
      <div id="main-report" className="flex flex-col gap-4">
        <p className="uppercase -mb-5 font-stretch-semi-condensed font-semibold">
          Assessment Report
        </p>
        <div className="flex flex-col gap-4">
          {reports[Number(courseId)] &&
            reports[Number(courseId)].scales.map((data) => (
              <div>
                <hr className="my-5 bg-sky-900" />
                <div>
                  <h1>{data.scale_name}</h1>
                  <p>{data.description}</p>
                </div>
                <div className="mt-5 gap-3 flex items-center justify-center w-full">
                  <Card className="p-5 bg-secondary">
                    <h2>Your Score</h2>
                    <p>{data.score}</p>
                  </Card>
                  <Card className="p-5 bg-secondary">
                    <h2>Interpretation</h2>
                    <p>{data.interpretation}</p>
                  </Card>
                </div>
                <div className="flex flex-col gap-2 mt-5 h-full items-center justify-center">
                  <h1>Interpretations</h1>
                  <div className="flex h-full flex-col gap-4">
                    {Object.entries(data.interpretations).map(
                      ([key, value], id) => (
                        <div className="p-5 bg-secondary">
                          <p>{value}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
