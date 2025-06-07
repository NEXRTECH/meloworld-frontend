"use client";

import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import LikertScaleInput from "@/components/ui/input/likert-scale-input";
import Button from "@/components/ui/button/button";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/components/stores/auth-store";
import { Question } from "@/components/types";
import { useCandidateStore } from "@/components/stores/candidate-store";
import { ImSpinner2 } from "react-icons/im";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { useToast } from "@/components/hooks/use-toast";

const AssessmentForm: React.FC = () => {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { courseId } = useParams();
  const courseIdNumber = Number(courseId);
  const quizCourseDict = useCandidateStore((s) => s.quizCourseDict);

  // Prefill user responses from submissionCourseDict if available
  
  const submissionCourseDict = useCandidateStore((s) => s.submissionCourseDict);
  
  const { getQuestionsByCourseId, submitAnswer } = useCandidateStore();
  const [pageIndex, setPageIndex] = useState(0);
  const [current, setCurrent] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);

  const { toast } = useToast();

  // Fetch questions
  useEffect(() => {
    if (token && courseId && !quizCourseDict[parseInt(courseId as string)]) {
      getQuestionsByCourseId(token, parseInt(courseId as string));
    }
  }, []);

  useEffect(() => {
    if (quizCourseDict[courseIdNumber]) {
      setQuestions(quizCourseDict[courseIdNumber]);
    }
    if (submissionCourseDict[courseIdNumber]) {
      setUserAnswers(submissionCourseDict[courseIdNumber].map(sub => sub.score));
    }
    if (submissionCourseDict[courseIdNumber] && submissionCourseDict[courseIdNumber].length > 0) {
      setPageIndex(submissionCourseDict[courseIdNumber].length - 1);
    }
  }, [quizCourseDict, submissionCourseDict, courseIdNumber]);

  // Initialize userAnswers
  useEffect(() => {
    if (questions.length) {
      setCurrent(questions[pageIndex]);
    }
  }, [questions]);

  // Handle answer selection
  const handleAnswer = (answer: number) => {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[pageIndex] = answer;
      return next;
    });
  };

  useEffect(() => {
    if (questions.length) {
      setCurrent(questions[pageIndex]);
    }
  }, [pageIndex]);

  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    // Submit answer call
    if (token && current) {
      submitAnswer(
        token,
        Number(courseId),
        5,
        current.quiz_id as number,
        current.id,
        currentAnswer,
        currentAnswer
      )
        .then(() => setPageIndex((i) => Math.min(questions.length - 1, i + 1)))
        .catch((err) => {
          toast({
            position: "top-right",
            title: "Error submitting answer",
            description: err.message,
            variant: "error",
          });
        });
      // setPageIndex((i) => Math.min(questions.length - 1, i + 1));
    }
  };

  const currentAnswer = userAnswers[pageIndex];

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      {/* 3D background */}

      {/* form container */}
      <main
        className={`
          relative
          bg-secondary/60
          rounded-xl shadow-xl z-10 flex flex-col
          inset-0 p-4
          md:inset-auto md:top-1/2 md:left-1/2
          md:-translate-x-1/2 md:-translate-y-1/2
          md:w-[100vw] md:h-[95vh] md:p-10 md:mt-5
        `}
      >
        <Button onClick={() => router.push(`/candidate/course/${courseId}`)} size="xs" className="w-fit mb-5">
          <FiChevronLeft />
          Back
        </Button>
        {/* progress bar */}
        <div className="flex-none w-full flex flex-col items-center gap-2 mb-4 md:gap-3 md:mb-6">
          <div className="relative m-1 w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-sky-900"
              initial={false}
              animate={{
                width: `${
                  questions.length
                    ? ((pageIndex + 1) / questions.length) * 100
                    : 0
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="font-semibold text-xs md:text-base">
            Question {pageIndex + 1} of {questions.length}
          </p>
        </div>

        {/* current question */}
        <div className="flex-1 overflow-y-auto w-full scrollbar-hide">
          {current ? (
            <ul className="list-none p-0 flex flex-col items-center">
              {/* Likert */}
              {current.type === "likert" && (
                <li className="w-full max-w-xl flex flex-col gap-4 md:gap-5">
                  <p className="font-semibold mb-5 text-base md:text-lg text-center px-2">
                    {current.question}
                  </p>
                  <LikertScaleInput
                    options={Object.entries(current.options).map(
                      ([key, label]) => label
                    )}
                    name={`q-${current.id}`}
                    value={currentAnswer}
                    onChange={(val: number) => handleAnswer(val)}
                  />
                </li>
              )}

              {/* Single-choice */}
              {/* {current.type === "single" && (
                <li className="w-full max-w-xl flex flex-col gap-4 md:gap-5">
                  <p className="font-semibold mb-5 text-base md:text-lg text-center px-2">
                    {current.question}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {current.options.map((opt, idx) => (
                      <Button
                        key={idx}
                        variant={currentAnswer === opt ? "filled" : "outline"}
                        primaryColor="#024a70"
                        onClick={() => handleAnswer(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </li>
              )} */}

              {/* Multiple-choice */}
              {/* {current.type === "multiple" && (
                <li className="w-full max-w-xl flex flex-col gap-4 md:gap-5">
                  <p className="font-semibold mb-5 text-base md:text-lg text-center px-2">
                    {current.question}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {(Object.values(current.options) as string[]).map(
                      (opt, idx) => {
                        const selected = (currentAnswer as string[]).includes(
                          opt
                        );
                        return (
                          <Button
                            key={idx}
                            variant={selected ? "filled" : "outline"}
                            primaryColor="#024a70"
                            onClick={() => {
                              const prev = currentAnswer as string[];
                              const next = prev.includes(opt)
                                ? prev.filter((o) => o !== opt)
                                : [...prev, opt];
                              handleAnswer(next);
                            }}
                          >
                            {opt}
                          </Button>
                        );
                      }
                    )}
                  </div>
                </li>
              )} */}
            </ul>
          ) : (
            <p className="text-center mt-10 w-full text-sm md:text-base">
              <ImSpinner2 className="animate-spin inline mr-2" />
              Loading questions...
            </p>
          )}
        </div>

        {/* navigation */}
        <div className="flex-none w-full flex items-center justify-between mt-4 md:mt-6 md:px-0 px-2">
          <button
            onClick={goPrev}
            disabled={pageIndex === 0}
            className="disabled:opacity-50 rounded-full hover:bg-sky-900/10 p-2 md:p-3"
          >
            <FiChevronLeft className="md:size-12 size-12" />
          </button>

          {pageIndex < questions.length - 1 ? (
            <button
              onClick={goNext}
              disabled={currentAnswer === undefined || currentAnswer === null}
              className="disabled:opacity-50 rounded-full hover:bg-sky-900/10 p-2 md:p-3"
            >
              <FiChevronRight className="md:size-12 size-12" />
            </button>
          ) : (
            <div className="flex items-center justify-end w-full">
              <Dialog
                open={openSubmitDialog}
                onOpenChange={setOpenSubmitDialog}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Submit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Assessment?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit your answers? You won't be
                      able to change them after submission.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" size="xs">
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      className="ml-2"
                      onClick={() => {
                        // Handle submission logic here
                        if (token && current) {
                          submitAnswer(
                            token,
                            Number(courseId),
                            5,
                            current.quiz_id as number,
                            current.id,
                            currentAnswer,
                            currentAnswer
                          )
                            .then(() => {
                              toast({
                                title: "Assessment Submitted",
                                description: "Your answers have been recorded.",
                                variant: "success",
                              });
                              setOpenSubmitDialog(false);

                              setTimeout(() => {
                                router.push(`/candidate/course/${courseId}`);
                              }, 2000);
                            })
                            .catch((err) => {
                              toast({
                                position: "top-right",
                                title: "Error submitting answer",
                                description: err.message,
                                variant: "error",
                              });
                            });
                          // setPageIndex((i) => Math.min(questions.length - 1, i + 1));
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssessmentForm;
