import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import {
  Chapter,
  Course,
  Norm,
  Organization,
  Question,
  Quiz,
  Report,
  Submission,
} from "../types";
import {
  fetchNorms,
  getAllQuizzesByChapter,
  updateQuiz,
  createQuiz as createQuizService,
  createQuestion,
} from "@/services/quizzes";
import { updateOrganization } from "@/services/organizations";
import {
  getAllAssessments,
  createCourse as createCourseService,
  deleteCourse as deleteCourseService,
} from "@/services/assessments";
import {
  getAllQuestionsByQuizId,
  getAllQuizzesByCourse,
} from "@/services/quizzes";
import {
  fetchCourseReport,
  fetchSubmissions,
  submitSingleAnswer,
} from "@/services/reports";
import { getAllChapters, updateChapterOnServer, createChapter as createChapterService } from "@/services/chapters";

export interface AdminStoreState {
  // Core data storage
  organizations: Organization[];
  norms: Norm[];
  courses: Course[];
  chaptersByCourse: Record<number, Chapter[]>;
  quizzes: Quiz[]; // quizzes by course ID
  quizzesByChapter: Record<number, Quiz[]>; // quizzes by chapter ID
  questions: Record<number, Question[]>; // questions by quiz ID
  reports: Record<number, Report>; // reports by course ID
  submissions: Record<number, Submission[]>; // submissions by course ID

  // Legacy properties for backward compatibility
  assessments: Course[];
  quizQuestionsCourseDict: Record<number, Question[]>;
  submissionCourseDict: Record<number, Submission[]>;
  courseQuizMetadataDict: Record<number, Quiz[]>;

  // Setters
  setOrganizations: (orgs: Organization[]) => void;
  setCourses: (courses: Course[]) => void;
  setChaptersByCourse: (courseId: number, chapters: Chapter[]) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  setQuestions: (quizId: number, questions: Question[]) => void;
  setReports: (reports: Record<number, Report>) => void;
  setSubmissions: (courseId: number, submissions: Submission[]) => void;
  setNorms: (norms: Norm[]) => void;
  // addQuestionToQuiz: 

  // Legacy setters for backward compatibility
  setAssessments: (assessments: Course[]) => void;
  setCourseQuizMetadataDict: (courseId: number, quizzes: Quiz[]) => void;
  setSubmissionCourseDict: (
    courseId: number,
    submissions: Submission[]
  ) => void;
  setQuizQuestionsCourseDict: (courseId: number, questions: Question[]) => void;

  // Data fetching methods
  getCourses: (token: string) => Promise<void>;
  getChaptersByCourse: (token: string, courseId: number) => Promise<void>;
  getQuizzesByChapter: (token: string, chapterId: number) => Promise<void>;
  getQuizzesByCourse: (token: string, courseId: number) => Promise<void>;
  getQuestionsByQuiz: (token: string, quizId: number) => Promise<void>;
  getReportsByCourse: (token: string, courseId: number) => Promise<void>;
  getSubmissionsByCourse: (token: string, courseId: number) => Promise<void>;
  getNorms: (token: string) => Promise<void>;

  // Legacy methods for backward compatibility
  getAssessments: (token: string) => Promise<void>;
  getQuestionsByCourseId: (token: string, courseId: number) => Promise<void>;
  getSubmissionsByCourseId: (token: string, courseId: number) => Promise<void>;
  getCourseReport: (token: string, courseId: number) => Promise<void>;
  submitAnswer: (
    token: string,
    courseId: number,
    chapterId: number,
    quizId: number,
    questionId: number,
    selectedOption: number,
    score: number
  ) => Promise<void>;

  // Assessment management
  createCourse: (
    token: string,
    courseData: { title: string; description?: string, image: string, normId: number }
  ) => Promise<void>;
  deleteCourse: (token: string, courseId: number) => Promise<void>;

  updateChapter: (token: string, chapterId: number, courseId: number, updatedChapter: Partial<Chapter>) => Promise<void>;
  createChapter: (token: string, chapter: { course_id: number, title: string, chapter_order: number, image: string, description: string, norm_id: number }) => Promise<void>;
  // Organization management
  fetchOrganizations: () => Promise<void>;
  updateOrganization: (
    orgId: number,
    updatedOrg: Partial<Organization>
  ) => Promise<void>;
  updateQuestion: (token: string, questionId: number, updatedQuestion: Partial<Question>) => Promise<void>;
  createQuestion: (token: string, question: Partial<Question>) => Promise<void>;
  // Utility methods
  clearAdminStore: () => void;
  getChaptersByCourseIdUtility: (courseId: number) => Chapter[] | undefined;
  getCourseByIdUtility: (courseId: number) => Course | undefined;
  getQuizzesByCourseIdUtility: (courseId: number) => Quiz[];
  getQuestionsByQuizIdUtility: (quizId: number) => Question[];
  getReportByCourseIdUtility: (courseId: number) => Report | undefined;
  getSubmissionsByCourseIdUtility: (courseId: number) => Submission[];

  createQuiz: (
    token: string,
    quizData: { chapter_id: number; course_id: number; title: string; description: string; image: string; norm_id: number }
  ) => Promise<void>;
  updateQuiz: (token: string, quizId: number, updatedQuiz: Partial<Quiz>) => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initialize state
        organizations: [],
        courses: [],
        chaptersByCourse: {},
        quizzes: [],
        quizzesByChapter: {},
        questions: {},
        reports: {},
        submissions: {},
        norms: [],

        // Legacy state for backward compatibility
        assessments: [],
        quizQuestionsCourseDict: {},
        submissionCourseDict: {},
        courseQuizMetadataDict: {},

        // Core setters
        setOrganizations: (orgs) => set({ organizations: orgs }),
        setCourses: (courses) => set({ courses }),
        setChaptersByCourse: (courseId, chapters) =>
          set((state) => ({
            chaptersByCourse: { ...state.chaptersByCourse, [courseId]: chapters },
          })),
        setQuizzes: (quizzes) =>
          set((state) => ({
            quizzes: quizzes,
          })),
        setQuizzesByChapter: (chapterId, quizzes) =>
          set((state) => ({
            quizzesByChapter: {
              ...state.quizzesByChapter,
              [chapterId]: quizzes,
            },
          })),
        setQuestions: (quizId, questions) =>
          set((state) => ({
            questions: { ...state.questions, [quizId]: questions },
          })),
        setReports: (reports) => set({ reports }),
        setSubmissions: (courseId, submissions) =>
          set((state) => ({
            submissions: { ...state.submissions, [courseId]: submissions },
          })),
        setNorms: (norms) => set({ norms }),
        updateChapter: async (token, chapterId, courseId, updatedChapter) => {
          try {
            const response = await updateChapterOnServer(token, chapterId, courseId, updatedChapter);
            if (response.ok) {
              const data = await response.json();
              const chapter: Chapter = data.chapter;
              set((state) => ({
                chaptersByCourse: {
                  ...state.chaptersByCourse,
                  [courseId]: state.chaptersByCourse[courseId].map((chapter) => chapter.id === chapterId ? chapter : chapter),
                },
              }));
              console.debug("Updated chapter:", data);
            }
          } catch (error) {
            console.error("Error updating chapter:", error);
          }
        },
        createChapter: async (token, { course_id, title, chapter_order, image, description, norm_id }) => {
          try {
            const response = await createChapterService(token, { course_id: course_id, title, chapter_order, image, description, norm_id });
            if (response.ok) {
              const data = await response.json();
              const chapter: Chapter = data.chapter ?? {};
              get().getChaptersByCourse(token, course_id);
            }
          } catch (error) {
            console.error("Error creating chapter:", error);
            throw error;
          }
        },
        updateQuestion: async (token, questionId, updatedQuestion) => {
          console.log({ token, questionId, updatedQuestion });
        },
        createQuestion: async (token, question) => {
          if(!question.quiz_id) {
            throw new Error("Quiz ID is required");
            return;
          }
          try {
            const response = await createQuestion(token, question);
            if (response.ok) {
              const data = await response.json();
              const question: Question = data.question ?? {};
              get().getQuestionsByQuiz(token, question.quiz_id!);
            }
          } catch (error) {
            console.error("Error creating question:", error);
            throw error;
          }
        },
        updateQuiz: async (token, quizId, updatedQuiz) => {
          try {
            console.log({ token, quizId, updatedQuiz });
          } catch (error) {
            console.error("Error updating quiz:", error);
            throw error;
          }
        },
        // Legacy setters for backward compatibility
        setAssessments: (assessments) => set({ assessments }),
        setCourseQuizMetadataDict: (courseId, quizzes) =>
          set((state) => ({
            courseQuizMetadataDict: {
              ...state.courseQuizMetadataDict,
              [courseId]: quizzes,
            },
          })),
        setSubmissionCourseDict: (courseId, submissions) =>
          set((state) => ({
            submissionCourseDict: {
              ...state.submissionCourseDict,
              [courseId]: submissions,
            },
          })),
        setQuizQuestionsCourseDict: (courseId, questions) =>
          set((state) => ({
            quizQuestionsCourseDict: {
              ...state.quizQuestionsCourseDict,
              [courseId]: questions,
            },
          })),

        // Core data fetching methods
        getCourses: async (token: string) => {
          try {
            const response = await getAllAssessments(token);
            if (response.ok) {
              const data = await response.json();
              const courses: Course[] = data.courses ?? [];
              console.debug("Fetched courses:", courses);
              set({ courses, assessments: courses }); // Keep legacy assessments in sync
            }
          } catch (error) {
            console.error("Error fetching courses:", error);
            throw error;
          }
        },

        getChaptersByCourse: async (token: string, courseId: number) => {
          try {
            const response = await getAllChapters(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const chapters: Chapter[] = data.chapters ?? [];
              console.debug("Fetched chapters for course ID", courseId, ":", chapters);
              // append to existing chapters
              set((state) => ({
                chaptersByCourse: {
                  ...state.chaptersByCourse,
                  [courseId]: chapters,
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching chapters by course:", error);
            throw error;
          }
        },

        getQuizzesByChapter: async (token: string, chapterId: number) => {
          try {
            const response = await getAllQuizzesByChapter(token, chapterId);
            if (response.ok) {
              const data = await response.json();
              const quizzes: Quiz[] = data.quizzes ?? [];
              console.debug(
                "Fetched quizzes for chapter ID",
                chapterId,
                ":",
                quizzes
              );
              set((state) => ({
                quizzesByChapter: {
                  ...state.quizzesByChapter,
                  [chapterId]: quizzes,
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching quizzes by chapter:", error);
            throw error;
          }
        },

        getQuizzesByCourse: async (token: string, courseId: number) => {
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

              set((state) => ({
                quizzes: quizzes,
                courseQuizMetadataDict: {
                  ...state.courseQuizMetadataDict,
                  [courseId]: quizzes,
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching quizzes by course:", error);
            throw error;
          }
        },
        getQuestionsByQuiz: async (token: string, quizId: number) => {
          try {
            const response = await getAllQuestionsByQuizId(token, quizId);
            if (response.ok) {
              const data = await response.json();
              const questions: Question[] = (data.questions ?? []).map(
                (question: Question) => ({
                  ...question,
                  quiz_id: quizId,
                })
              );
              console.debug(
                "Fetched questions for quiz ID",
                quizId,
                ":",
                questions
              );

              set((state) => ({
                questions: { ...state.questions, [quizId]: questions },
              }));
            }
          } catch (error) {
            console.error("Error fetching questions by quiz:", error);
            throw error;
          }
        },
        getReportsByCourse: async (token: string, courseId: number) => {
          try {
            const response = await fetchCourseReport(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const report: Report = data ?? {};
              console.debug(
                "Fetched report for course ID",
                courseId,
                ":",
                report
              );

              set((state) => ({
                reports: { ...state.reports, [courseId]: report },
              }));
            }
          } catch (error) {
            console.error("Error fetching report by course:", error);
            throw error;
          }
        },
        getSubmissionsByCourse: async (token: string, courseId: number) => {
          try {
            const response = await fetchSubmissions(token, courseId);
            if (response.ok) {
              const data = await response.json();
              const submissions: Submission[] = data.submissions ?? [];
              console.debug(
                "Fetched submissions for course ID",
                courseId,
                ":",
                submissions
              );

              set((state) => ({
                submissions: { ...state.submissions, [courseId]: submissions },
                submissionCourseDict: {
                  ...state.submissionCourseDict,
                  [courseId]: submissions,
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching submissions by course:", error);
          }
        },
        getNorms: async (token: string) => {
          try {
            const response = await fetchNorms(token);
            if (response.ok) {
              const data = await response.json();
              const norms: Norm[] = data.norms ?? [];
              console.debug("Fetched norms:", norms);
              set({ norms });
            }
          } catch (error) {
            console.error("Error fetching norms:", error);
            throw error;
          }
        },
        // Legacy methods for backward compatibility
        getAssessments: async (token: string) => {
          const { getCourses } = get();
          await getCourses(token);
        },
        getQuestionsByCourseId: async (token: string, courseId: number) => {
          try {
            const { getQuizzesByCourse } = get();
            await getQuizzesByCourse(token, courseId);

            // Get questions for each quiz
            const state = get();
            const quizzes =
              state.quizzes.filter((quiz) => quiz.course_id === courseId) || [];

            for (const quiz of quizzes) {
              await state.getQuestionsByQuiz(token, quiz.id);
            }
          } catch (error) {
            console.error("Error fetching questions by course ID:", error);
            throw error;
          }
        },

        getSubmissionsByCourseId: async (token: string, courseId: number) => {
          const { getSubmissionsByCourse } = get();
          await getSubmissionsByCourse(token, courseId);
        },
        getCourseReport: async (token: string, courseId: number) => {
          const { getReportsByCourse } = get();
          await getReportsByCourse(token, courseId);
        },
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

        // Assessment management
        createCourse: async (token, { title, description, image, normId }) => {
          try {
            const response = await createCourseService(token, { title, description, image, norm_id:normId });
            if (response.ok) {
              // Refetch assessments to update the list
              get().getAssessments(token);
            } else {
              // Handle non-ok responses
              const errorData = await response.json();
              console.error("Failed to create assessment:", errorData);
              throw new Error(errorData.message || "Failed to create assessment");
            }
          } catch (error) {
            console.error("Error creating assessment:", error);
            throw error;
          }
        },
        deleteCourse: async (token, courseId) => {
          try {
            const response = await deleteCourseService(token, courseId);
            if (response.ok) {
              // Refetch assessments to update the list
              get().getAssessments(token);
            } else {
              throw new Error("Failed to delete assessment");
            }
          } catch (error) {
            console.error("Error deleting assessment:", error);
            throw error;
          }
        },

        // Organization management
        fetchOrganizations: async () => {
          // TODO: Replace with a real API call to fetch organizations
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
        updateOrganization: async (
          orgId: number,
          updatedOrg: Partial<Organization>
        ) => {
          try {
            const response = await updateOrganization(orgId, updatedOrg);
            if (!response.ok) {
              throw new Error("Failed to update organization");
            }
            const data = await response.data.organization;

            // Update the organization in the store
            set((state) => ({
              organizations: state.organizations.map((org) =>
                org.organization_id === data.organization_id ? data : org
              ),
            }));
          } catch (error) {
            console.error("Error updating organization:", error);
          }
        },

        // Utility methods
        clearAdminStore: () =>
          set(() => ({
            organizations: [],
            courses: [],
            quizzes: [],
            questions: {},
            reports: {},
            submissions: {},
            assessments: [],
            quizQuestionsCourseDict: {},
            courseQuizMetadataDict: {},
            submissionCourseDict: {},
          })),
        getChaptersByCourseIdUtility: (courseId: number) => {
          const state = get();
          return state.chaptersByCourse[courseId];
        },
        getCourseByIdUtility: (courseId: number) => {
          const state = get();
          return state.courses.find((course) => course.id === courseId);
        },
        getQuizzesByCourseIdUtility: (courseId: number) => {
          const state = get();
          return state.quizzes.filter((quiz) => quiz.course_id === courseId);
        },
        getQuestionsByQuizIdUtility: (quizId: number) => {
          const state = get();
          return state.questions[quizId] || [];
        },
        getReportByCourseIdUtility: (courseId: number) => {
          const state = get();
          return state.reports[courseId];
        },
        getSubmissionsByCourseIdUtility: (courseId: number) => {
          const state = get();
          return state.submissions[courseId] || [];
        },

        createQuiz: async (token, quizData) => {
          try {
            const response = await createQuizService(token, quizData);
            if (response.ok) {
              const data = await response.json();
              // Optionally refresh quizzes for the chapter
              if (quizData.chapter_id) {
                await get().getQuizzesByChapter(token, quizData.chapter_id);
              }
            } else {
              throw new Error('Failed to create quiz');
            }
          } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
          }
        },
      }),
      {
        name: "admin-store", // key to store in storage (must be unique)
        // Optionally add storage and other persist options here
      }
    )
  )
);
