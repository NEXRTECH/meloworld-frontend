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
import { assignCourseToOrg, getAllOrganizations, getAssignedCourses, removeCourseFromOrg, updateOrganization } from "@/services/organizations";
import {
  getAllAssessments,
  createCourse as createCourseService,
  deleteCourse as deleteCourseService,
  createNorm as createNormService,
  updateNorm as updateNormService,
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
import { getAllChapters, updateChapterOnServer, createChapter as createChapterService, deleteChapter as deleteChapterAPI, deleteChapter } from "@/services/chapters";

export interface AdminStoreState {
  // Core data storage
  organizations: Organization[];
  norms: Norm[];
  courses: Course[];
  chaptersByCourse: Record<string, Chapter[]>;
  quizzes: Quiz[]; // quizzes by course ID
  quizzesByChapter: Record<string, Quiz[]>; // quizzes by chapter ID
  questions: Record<string, Question[]>; // questions by quiz ID
  reports: Record<string, Report>; // reports by course ID
  submissions: Record<string, Submission[]>; // submissions by course ID

  // Legacy properties for backward compatibility
  assessments: Course[];
  quizQuestionsCourseDict: Record<string, Question[]>;
  submissionCourseDict: Record<string, Submission[]>;
  courseQuizMetadataDict: Record<string, Quiz[]>;
  scalesByOrg: Record<string, string[]>; // scales by organization ID

  // Setters
  setOrganizations: (orgs: Organization[]) => void;
  setCourses: (courses: Course[]) => void;
  setChaptersByCourse: (courseId: string, chapters: Chapter[]) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  setQuestions: (quizId: string, questions: Question[]) => void;
  setReports: (reports: Record<string, Report>) => void;
  setSubmissions: (courseId: string, submissions: Submission[]) => void;
  setNorms: (norms: Norm[]) => void;
  // addQuestionToQuiz: 

  // Legacy setters for backward compatibility
  setAssessments: (assessments: Course[]) => void;
  setCourseQuizMetadataDict: (courseId: string, quizzes: Quiz[]) => void;
  setSubmissionCourseDict: (
    courseId: string,
    submissions: Submission[]
  ) => void;
  setQuizQuestionsCourseDict: (courseId: string, questions: Question[]) => void;
  setScalesByOrg: (orgId: string) => Promise<void>;

  // Data fetching methods
  getCourses: (token: string) => Promise<void>;
  getChaptersByCourse: (token: string, courseId: string) => Promise<void>;
  getQuizzesByChapter: (token: string, chapterId: string) => Promise<void>;
  getQuizzesByCourse: (token: string, courseId: string) => Promise<void>;
  getQuestionsByQuiz: (token: string, quizId: string) => Promise<void>;
  getReportsByCourse: (token: string, courseId: string) => Promise<void>;
  getSubmissionsByCourse: (token: string, courseId: string) => Promise<void>;
  getNorms: (token: string) => Promise<void>;
  createNorm: (token: string, normData: Norm, type: string) => Promise<void>;
  updateNorm: (token: string, normData: Norm, type: string) => Promise<void>;

  // Legacy methods for backward compatibility
  getAssessments: (token: string) => Promise<void>;
  getQuestionsByCourseId: (token: string, courseId: string) => Promise<void>;
  getSubmissionsByCourseId: (token: string, courseId: string) => Promise<void>;
  getCourseReport: (token: string, courseId: string) => Promise<void>;
  submitAnswer: (
    token: string,
    courseId: string,
    chapterId: string,
    quizId: string,
    questionId: string,
    selectedOption: string,
    score: string
  ) => Promise<void>;

  // Assessment management
  createCourse: (
    token: string,
    courseData: { title: string; description?: string, image: string, normId: number, type: string }
  ) => Promise<void>;
  deleteCourse: (token: string, courseId: string) => Promise<void>;

  updateChapter: (token: string, chapterId: string, courseId: string, updatedChapter: Partial<Chapter>) => Promise<void>;
  createChapter: (token: string, chapter: { course_id: string, title: string, chapter_order: number, image: string, description: string, norm_id: number }) => Promise<void>;
  deleteChapter: (token: string, chapterId: string, courseId: string) => Promise<void>;
  // Organization management
  fetchOrganizations: () => Promise<void>;
  updateOrganization: (
    orgId: string,
    updatedOrg: Partial<Organization>
  ) => Promise<void>;
  assignScaleToOrg: (token: string, orgId: string, scaleId: string) => Promise<void>;
  removeScaleFromOrg: (token: string, orgId: string, scaleId: string) => Promise<void>;
  updateQuestion: (token: string, questionId: string, updatedQuestion: Partial<Question>) => Promise<void>;
  createQuestion: (token: string, question: Partial<Question>) => Promise<void>;
  // Utility methods
  clearAdminStore: () => void;
  getChaptersByCourseIdUtility: (courseId: string) => Chapter[] | undefined;
  getCourseByIdUtility: (courseId: string) => Course | undefined;
  getQuizzesByCourseIdUtility: (courseId: string) => Quiz[];
  getQuestionsByQuizIdUtility: (quizId: string) => Question[];
  getReportByCourseIdUtility: (courseId: string) => Report | undefined;
  getSubmissionsByCourseIdUtility: (courseId: string) => Submission[];

  createQuiz: (
    token: string,
    quizData: { chapter_id: string; course_id: string; title: string; description: string; image: string; norm_id: number }
  ) => Promise<void>;
  updateQuiz: (token: string, quizId: string, updatedQuiz: Partial<Quiz>) => Promise<void>;
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
        scalesByOrg: {},
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
                  [courseId]: state.chaptersByCourse[courseId].map((chapter) => chapter._id === chapterId ? chapter : chapter),
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
        deleteChapter: async (token, chapterId, courseId) => {
          await deleteChapterAPI(token, chapterId, courseId);

          await get().getChaptersByCourse(token, courseId);
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
        setScalesByOrg: async (orgId) => {
          try {
            const response = await getAssignedCourses(orgId);
            if(response.ok) {
              const courses = response.data.courses;
              console.log('API Response courses:', courses);
              
              // Map the course IDs - try different possible field names
              const courseIds = courses.map(course => {
                // Try different possible field names for course ID
                return course.course_id || course._id || course.id || course.courseId;
              });
              
              console.log('Mapped course IDs:', courseIds);
              
              set((state) => ({
                scalesByOrg: {
                  ...state.scalesByOrg,
                  [orgId]: courseIds,
                },
              }));
            }
          } catch (err) {
            console.error(err);
            throw err;
          }
        },
          
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

        getChaptersByCourse: async (token: string, courseId: string) => {
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

        getQuizzesByChapter: async (token: string, chapterId: string) => {
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

        getQuizzesByCourse: async (token: string, courseId: string) => {
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
        getQuestionsByQuiz: async (token: string, quizId: string) => {
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
        getReportsByCourse: async (token: string, courseId: string) => {
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
        getSubmissionsByCourse: async (token: string, courseId: string) => {
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
        getQuestionsByCourseId: async (token: string, courseId: string) => {
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

        getSubmissionsByCourseId: async (token: string, courseId: string) => {
          const { getSubmissionsByCourse } = get();
          await getSubmissionsByCourse(token, courseId);
        },
        getCourseReport: async (token: string, courseId: string) => {
          const { getReportsByCourse } = get();
          await getReportsByCourse(token, courseId);
        },
        submitAnswer: async (
          token: string,
          courseId: string,
          chapterId: string,
          quizId: string,
          questionId: string,
          selectedOption: string,
          score: string
        ) => {
          try {
            const response = await submitSingleAnswer(
              token,
              courseId,
              chapterId,
              quizId,
              questionId,
              parseInt(selectedOption),
              parseInt(score)
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
        createCourse: async (token, { title, description, image, normId, type }) => {
          try {
            const response = await createCourseService(token, { title, description, image, norm_id:normId, type });
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
          const response = await getAllOrganizations();
          if (response.ok) {
            const data = await response.data;
            const organizations: Organization[] = data.organizations ?? [];
            set({ organizations });
            console.debug("Fetched organizations:", organizations);
          } else {
            throw new Error("Failed to fetch organizations");
          }
        },
        updateOrganization: async (
          orgId: string,
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
        assignScaleToOrg: async (token: string, orgId: string, scaleId: string) => {
          try {
            const response = await assignCourseToOrg(token, orgId, scaleId);
            if(response.ok) {
              get().setScalesByOrg(orgId);
            }
          } catch (error) {
            console.error("Error assigning scale to organization:", error);
            throw error;
          }
        },
        removeScaleFromOrg: async (token: string, orgId: string, scaleId: string) => {
          try {
            const response = await removeCourseFromOrg(token, orgId, scaleId);
            if(response.ok) {
              get().setScalesByOrg(orgId);
            }
          } catch (error) {
            console.error("Error assigning scale to organization:", error);
            throw error;
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
        getChaptersByCourseIdUtility: (courseId: string) => {
          const state = get();
          return state.chaptersByCourse[courseId];
        },
                  getCourseByIdUtility: (courseId: string) => {
            const state = get();
            return state.courses.find((course) => course._id === courseId);
          },
        getQuizzesByCourseIdUtility: (courseId: string) => {
          const state = get();
          return state.quizzes.filter((quiz) => quiz.course_id === courseId);
        },
        getQuestionsByQuizIdUtility: (quizId: string) => {
          const state = get();
          return state.questions[quizId] || [];
        },
        getReportByCourseIdUtility: (courseId: string) => {
          const state = get();
          return state.reports[courseId];
        },
        getSubmissionsByCourseIdUtility: (courseId: string) => {
          const state = get();
          return state.submissions[courseId] || [];
        },

        createNorm: async (token, normData, type) => {
          try {
            const response = await createNormService(token, normData, type);
            if(response.ok) {
              get().getNorms(token);
            } else {
              throw new Error("Failed to create norm");
            }
          } catch (error) {
            console.error("Error creating norm:", error);
            throw error;
          }
        },

        updateNorm: async (token, normData, type) => {
          try {
            if (!normData.normId) {
              throw new Error("normId is required for update");
            }

            const response = await updateNormService(
              token,
              normData.normId,   // 🔴 QUERY PARAM
              normData,
              type
            );

            if (response.ok) {
              get().getNorms(token);
            } else {
              const err = await response.text();
              console.error("Backend error:", err);
              throw new Error("Failed to update norm");
            }
          } catch (error) {
            console.error("Error updating norm:", error);
            throw error;
          }
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
