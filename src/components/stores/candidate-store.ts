import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import {
  Course,
  Organization,
  Question,
  Quiz,
  Report,
  Submission,
} from "../types";
import { getAllAssessments } from "@/services/assessments";
import {
  getAllQuestionsByQuizId,
  getAllQuizzesByCourse,
} from "@/services/quizzes";
import { NumberMap } from "framer-motion";
import {
  fetchCourseReport,
  fetchSubmissions,
  submitSingleAnswer,
} from "@/services/reports";
import { error } from "console";

export interface CandidateStoreState {
  // Add your state properties here
  assessments: Course[];
  organizations: Organization[];
  reports: Record<number, Report>;
  quizCourseDict: Record<number, Question[]>; // Assuming you want to keep track of quizzes by Course ID
  submissionCourseDict: Record<number, Submission[]>;
  // Add your actions/methods here
  setOrganizations: (organizations: Organization[]) => void;
  setReports: (reports: Record<number, Report>) => void;
  setSubmissionCourseDict: (
    courseId: number,
    submissions: Submission[]
  ) => void;
  getCourseReport: (token: string, courseId: number) => Promise<void>;
  getOrganizations: (token?: string) => Promise<void>;
  setAssessments: (assessments: Course[]) => void;
  getAssessments: (token: string) => Promise<void>;
  getQuestionsByCourseId: (token: string, courseId: number) => Promise<void>;
  getSubmissionsByCourseId: (token: string, courseId: number) => Promise<void>;
  setQuizCourseDict: (courseId: number, questions: Question[]) => void;
  submitAnswer: (
    token: string,
    courseId: number,
    chapterId: number,
    quizId: number,
    questionId: number,
    selectedOption: number,
    score: number
  ) => Promise<void>;
  clearCandidateStore: () => void;
}

export const useCandidateStore = create<CandidateStoreState>()(
  devtools(
    persist(
      (set) => ({
        // Initialize your state
        assessments: [],
        reports: {},
        organizations: [],
        quizCourseDict: {},
        submissionCourseDict: {},
        // Define actions
        setReports: (reports: Record<number, Report>) => set({ reports }),
        setOrganizations: (organizations: Organization[]) =>
          set({ organizations }),
        setAssessments: (assessments: Course[]) => set({ assessments }),
        getOrganizations: async (token: string) => {
          const dummyData: Organization[] = [
            {
              organization_id: 1,
              organization_name: "Host2",
              organization_type: "Corporate",
              contact_email: "admin1@acmecorp.com",
              is_approved: false,
              is_enabled: true,
              created_at: "2025-05-05T18:49:52.677Z",
              updated_at: "2025-05-05T18:49:52.677Z",
              metadata: null,
            },
            {
              organization_id: 3,
              organization_name: "Test International",
              organization_type: "Corporate",
              contact_email: "admin1@acmecorp.com",
              is_approved: false,
              is_enabled: false,
              created_at: "2025-05-21T14:12:09.237Z",
              updated_at: "2025-05-21T16:42:05.684Z",
              metadata: null,
            },
          ];
          set({ organizations: dummyData });
        },
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
                  let questions: Question[] = questionsData.questions ?? [];
                  questions = questions.map((question) => ({
                    ...question,
                    quiz_id: quiz.id,
                  }));
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
        getSubmissionsByCourseId: async (token: string, courseId: number) => {
          try {
            const response = await fetchSubmissions(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const submissions: Submission[] = data.submissions ?? [];
              // console.log(submissions)
              set((state) => ({
                submissionCourseDict: {
                  ...state.submissionCourseDict,
                  [courseId]: submissions,
                },
              }));
            }
          } catch {}
        },
        setQuizCourseDict: (courseId: number, questions: Question[]) =>
          set((state) => ({
            quizCourseDict: {
              ...state.quizCourseDict,
              [courseId]: questions,
            },
          })),
        submitAnswer: async (
          token: string,
          courseId: number,
          chapterId: number,
          quizId: number,
          questionId: number,
          selectedOption: number,
          score: number
        ) => {
          try {
            const response = await submitSingleAnswer(
              token,
              courseId,
              chapterId,
              quizId,
              questionId,
              selectedOption,
              score
            );
            if (response.status === 201) {
              console.log("Answer stored!");
            } else if (response.status >= 400 && response.status < 500) {
              throw new Error("Experienced a client error");
            }
          } catch (error) {
            console.error("Error submitting answer:", error);
            throw error;
          }
        },
        getCourseReport: async (token: string, courseId: number) => {
          try {
            const response = await fetchCourseReport(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const report: Report = data ?? {};
              console.debug("Fetched report:", report);
              set((state) => ({
                reports: { ...state.reports, [courseId]: report },
              }));
            }
          } catch (err) {
            console.error(err);
            throw err;
          }
        },
        setSubmissionCourseDict: (
          courseId: number,
          submissions: Submission[]
        ) =>
          set((state) => ({
            submissionCourseDict: {
              ...state.submissionCourseDict,
              [courseId]: submissions,
            },
          })),
        clearCandidateStore: () =>
          set(() => ({
            assessments: [],
            reports: {},
            quizCourseDict: {},
          })),
      }),
      {
        name: "candidate-store", // key to store in storage (must be unique)
      }
    )
  )
);
