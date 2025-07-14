import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { Course, Organization, UserRole } from "../types";
import { getAllAssessments } from "@/services/assessments";
import { getAssignedCourses } from "@/services/organizations";
import { assert } from "console";

interface OrgMetadata {
  organization_id: number;
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

  // Loading states
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, role: UserRole, metadata: OrgMetadata) => void;
  getAssignedCourses: (orgId: string) => Promise<void>;
  clearAuth: () => void;
  setOrganization: (org: Organization) => void;
  setEmployees: (employees: any[]) => void;
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
        setEmployees: (employees) =>
          set({ employees }, false, "org/setEmployees"),

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
