import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Course, Organization, Quiz } from "../types";
import { updateQuiz } from "@/services/quizzes";
import { updateOrganization } from "@/services/organizations";
import { getAllAssessments } from "@/services/assessments";

export interface AdminStoreState {
  // Add your state properties here
  organizations: Organization[];
  assessments: Course[];
  // Define more properties as needed

  // Add your actions/methods here
  setOrganizations: (orgs: Organization[]) => void;
  setAssessments: (assessments: Course[]) => void;
  getAssessments: (token: string) => Promise<void>;
  fetchOrganizations: () => Promise<void>;
  updateOrganization: (
    orgId: number,
    updatedOrg: Partial<Organization>
  ) => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>()(
  devtools(
    persist(
      (set) => ({
        // Initialize your state
        organizations: [],
        assessments: [],
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
        setOrganizations: (orgs) => set({ organizations: orgs }),
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
      }),
      {
        name: "admin-store", // key to store in storage (must be unique)
        // Optionally add storage and other persist options here
      }
    )
  )
);
