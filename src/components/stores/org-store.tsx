import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { Course, Organization, UserRole } from "../types";
import { getAllAssessments } from "@/services/assessments";
import { getAssignedCourses, getOrgEmployees, getOrgReports, getOrgReportsPct, getOrgReportsAvgVsOthers } from "@/services/organizations";
import { assert } from "console";

interface OrgMetadata {
  organization_id: string;
  organization_name: string;
  organization_type: string;
  contact_email: string;
  is_approved: boolean;
  is_enabled: boolean;
  [k: string]: any;
}

interface OrgStore {
  // Auth state
  token: string | null;
  userRole: UserRole | null;
  metadata: OrgMetadata | null;
  hydrated: boolean;
  assignedCourses: Course[];

  // Organization state
  currentOrganization: Organization | null;
  employees: any[];
  reports: any[];
  reportsPct: any[];
  comparisons: any[];

  // Loading states
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, role: UserRole, metadata: OrgMetadata) => void;
  getAssignedCourses: (orgId: string) => Promise<void>;
  clearAuth: () => void;
  setOrganization: (org: Organization) => void;
  getEmployees: (token: string, orgId: string) => Promise<void>;
  setEmployees: (employees: any[]) => void;
  getReports: (orgId: string, token: string) => Promise<void>;
  getReportsPct: (orgId: string, courseId: string, token: string) => Promise<void>;
  getComparisons: (courseId: string, token: string) => Promise<void>;
  clearComparisons: () => void;
  clearReportsPct: () => void;
  setReports: (reports: any[]) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useOrgStore = create<OrgStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        token: null,
        userRole: null,
        metadata: null,
        hydrated: false,
        currentOrganization: null,
        assignedCourses: [],
        employees: [],
        reports: [],
        reportsPct: [],
        comparisons: [],
        isLoading: false,
        isAuthenticated: false,

        // Actions
        setAuth: (token, role, metadata) =>
          set(
            {
              token,
              userRole: role,
              metadata,
              isAuthenticated: true,
            },
            false,
            "org/setAuth"
          ),

        clearAuth: () =>
          set(
            {
              token: null,
              userRole: null,
              metadata: null,
              currentOrganization: null,
              employees: [],
              reports: [],
              isAuthenticated: false,
            },
            false,
            "org/clearAuth"
          ),

        setOrganization: (org) =>
          set({ currentOrganization: org }, false, "org/setOrganization"),

        getAssignedCourses: async (orgId: string) => {
          try {
            const response = await getAssignedCourses(orgId);
            if (response.ok) {
              const data = await response.data;
              const courses: Course[] = data.courses;
              set({ assignedCourses: courses });
            }
          } catch (error) {
            console.error("Fetching courses failed:", error.message);
            throw error;
          }
        },
        getEmployees: async (token: string, orgId: string) => {
          try {
            const response = await getOrgEmployees(token, orgId);
            if (response.ok) {
              const data = await response.data;
              set({ employees: data.organization.users });
            }
          }
          catch (error) {
            console.error("Fetching employees failed:", error.message);
            throw error;
          }
        },
        setEmployees: (employees) =>
          set({ employees }, false, "org/setEmployees"),

        getReports: async (orgId: string, token: string) => {
          try {
            const response = await getOrgReports(orgId, token);
            if(response.ok) {
              const data = await response.json();
              const reports = data.results;
              set({reports: reports})
            }
          }
          catch (error) {
            console.error("Fetching reports failed:", error.message);
            throw error;
          }
        },

        getReportsPct: async (orgId: string, courseId: string, token: string) => {
          try {
            const response = await getOrgReportsPct(orgId, courseId, token);
            if(response.ok) {
              const data = await response.json();
              const newReportsPct = data.results;
              // Append to existing reportsPct instead of replacing
              set((state) => ({
                reportsPct: [...state.reportsPct, ...newReportsPct]
              }))
            }
          }
          catch (error) {
            console.error("Fetching reports percentage failed:", error.message);
            throw error;
          }
        },

        getComparisons: async (courseId: string, token: string) => {
          try {
            const response = await getOrgReportsAvgVsOthers(token, courseId);
            if(response.ok) {
              const data = await response.json();
              const comparisons = data.results;
              // Append to existing comparisons instead of replacing
              set((state) => ({
                comparisons: [...state.comparisons, ...comparisons]
              }))
            }
          }
          catch (error) {
            console.error("Fetching comparisons failed:", error.message);
            throw error;
          }
        },

        clearComparisons: () => set({ comparisons: [] }, false, "org/clearComparisons"),

        clearReportsPct: () => set({ reportsPct: [] }, false, "org/clearReportsPct"),

        setReports: (reports) => set({ reports }, false, "org/setReports"),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, "org/setLoading"),

        logout: () => {
          const { clearAuth } = get();
          clearAuth();
        },
      }),
      {
        name: "org-storage",
        storage: createJSONStorage(() => localStorage),

        // Rehydration callback
        onRehydrateStorage: () => (state) => {
          if (state) state.hydrated = true;
        },
      }
    )
  )
);
