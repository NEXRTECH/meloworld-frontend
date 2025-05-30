import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Course, Question, Quiz } from "../types";
import { getAllAssessments } from "@/services/assessments";
import {
  getAllQuestionsByQuizId,
  getAllQuizzesByCourse,
} from "@/services/quizzes";
import { clear } from "console";

export interface CandidateStoreState {
  // Add your state properties here
  assessments: Course[];
  reports: any[];
  quizCourseDict: Record<number, Question[]>; // Assuming you want to keep track of quizzes by Course ID

  // Add your actions/methods here
  setAssessments: (assessments: Course[]) => void;
  getAssessments: (token: string) => Promise<void>;
  getQuestionsByCourseId: (token: string, courseId: number) => Promise<void>;
  setQuizCourseDict: (courseId: number, questions: Question[]) => void;
  setReports: (reports: any[]) => void;
  clearCandidateStore: () => void;
}

export const useCandidateStore = create<CandidateStoreState>()(
  devtools(
    persist(
      (set) => ({
        // Initialize your state
        assessments: [],
        reports: [],
        quizCourseDict: {},
        // Define actions
        setAssessments: (assessments: Course[]) => set({ assessments }),
        getAssessments: async (token: string) => {
          try {
            const response = await getAllAssessments(token);
            if (response.ok) {
              const data = await response.json();
              const assessments: Quiz[] = data.courses ?? [];
              console.debug("Fetched assessments:", assessments);
              set({ assessments });
            }
          } catch (error) {
            console.error("Error fetching assessments:", error);
            throw error;
          }
        },
        getQuestionsByCourseId: async (token: string, courseId: number) => {
          try {
            const response = await getAllQuizzesByCourse(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const quizzes: Quiz[] = data.quizzes ?? [];
              console.debug(
                "Fetched quizzes for course ID",
                courseId,
                ":",
                quizzes
              );
              for (const quiz of quizzes) {
                const questionsResponse = await getAllQuestionsByQuizId(
                  token,
                  quiz.id
                );
                if (questionsResponse.ok) {
                  const questionsData = await questionsResponse.json();
                  const questions: Question[] = questionsData.questions ?? [];
                  console.debug(
                    "Fetched questions for quiz ID",
                    quiz.id,
                    ":",
                    questions
                  );
                  set((state) => ({
                    quizCourseDict: {
                      ...state.quizCourseDict,
                      [courseId]: [
                        ...(state.quizCourseDict[courseId] || []),
                        ...questions,
                      ],
                    },
                  }));
                }
              }
            }
          } catch (error) {
            console.error("Error fetching questions by course ID:", error);
            throw error;
          }
        },
        setQuizCourseDict: (courseId: number, questions: Question[]) =>
          set((state) => ({
            quizCourseDict: {
              ...state.quizCourseDict,
              [courseId]: questions,
            },
          })),
        setReports: (reports: any[]) => set({ reports }),
        clearCandidateStore: () =>
          set(() => ({
            assessments: [],
            reports: [],
            quizCourseDict: {},
          })),
      }),

      {
        name: "candidate-store", // key to store in storage (must be unique)
      }
    )
  )
);
