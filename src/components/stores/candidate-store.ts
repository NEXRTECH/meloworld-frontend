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
import { getAllOrganizations } from "@/services/organizations";

export interface CandidateStoreState {
  // Add your state properties here
  assessments: Course[];
  organizations: Organization[];
  reports: Record<string, Report>;
  quizQuestionsCourseDict: Record<string, Question[]>;
  submissionCourseDict: Record<string, Submission[]>;
  courseQuizMetadataDict: Record<string, Quiz[]>;
  // Add your actions/methods here
  setOrganizations: (organizations: Organization[]) => void;
  setReports: (reports: Record<string, Report>) => void;
  setCourseQuizMetadataDict: (courseId: string, quizzes: Quiz[]) => void;
  setSubmissionCourseDict: (
    courseId: string,
    submissions: Submission[]
  ) => void;
  getCourseReport: (token: string, courseId: string) => Promise<void>;
  getOrganizations: () => Promise<void>;
  setAssessments: (assessments: Course[]) => void;
  getAssessments: (token: string) => Promise<void>;
  getQuestionsByCourseId: (token: string, courseId: string) => Promise<void>;
  getSubmissionsByCourseId: (token: string, courseId: string) => Promise<void>;
  setQuizQuestionsCourseDict: (courseId: string, questions: Question[]) => void;
  submitAnswer: (
    token: string,
    courseId: string,
    chapterId: string,
    quizId: string,
    questionId: string,
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
        quizQuestionsCourseDict: {},
        submissionCourseDict: {},
        courseQuizMetadataDict: {},
        // Define actions
        setReports: (reports: Record<string, Report>) => set({ reports }),
        setOrganizations: (organizations: Organization[]) =>
          set({ organizations }),
        setAssessments: (assessments: Course[]) => set({ assessments }),
        setCourseQuizMetadataDict: (courseId: string, quizzes: Quiz[]) =>
          set((state) => ({
            courseQuizMetadataDict: {
              ...state.courseQuizMetadataDict,
              [courseId]: quizzes,
            },
          })),
        getOrganizations: async () => {
          try {
            const response = await getAllOrganizations();
            if(response.ok) {
              const data = await response.data;
              const organizations: Organization[] = data.organizations ?? [];
              set({organizations})
            }
          } catch (err) {
            console.error(err);
            throw error;
          }
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
        getQuestionsByCourseId: async (token: string, courseId: string) => {
          try {
            const response = await getAllQuizzesByCourse(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const quizzes: Quiz[] = data.quizzes ?? [];
              set((state) => ({
                courseQuizMetadataDict: {
                  ...state.courseQuizMetadataDict,
                  [courseId]: quizzes,
                },
              }));
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
                    quizQuestionsCourseDict: {
                      ...state.quizQuestionsCourseDict,
                      [courseId]: [
                        ...(state.quizQuestionsCourseDict[courseId] || []),
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
        getSubmissionsByCourseId: async (token: string, courseId: string) => {
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
        setQuizQuestionsCourseDict: (courseId: string, questions: Question[]) =>
          set((state) => ({
            quizQuestionsCourseDict: {
              ...state.quizQuestionsCourseDict,
              [courseId]: questions,
            },
          })),
        submitAnswer: async (
          token: string,
          courseId: string,
          chapterId: string,
          quizId: string,
          questionId: string,
          selectedOption: number,
          score: number
        ) => {
          console.log(selectedOption, score)
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
        getCourseReport: async (token: string, courseId: string) => {
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
          courseId: string,
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
            quizQuestionsCourseDict: {},
            courseQuizMetadataDict: {},
            submissionCourseDict: {},
          })),
      }),
      {
        name: "candidate-store", // key to store in storage (must be unique)
      }
    )
  )
);
