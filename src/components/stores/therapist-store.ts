import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Patient, Session } from "../types";
import {
  cancelSession,
  createSession,
  endSession,
  getAllSessionsByTherapist,
  getSession,
  startSession,
  updateSession,
} from "@/services/therapist";

export interface TherapistStoreState {
  // Add your state properties here
  sessions: Session[];
  patients: Patient[];

  // Add your actions/methods here
  setSessions: (sessions: Session[]) => void;
  fetchSessionsByTherapistId: (
    therapistId: string,
    status?: "Completed" | "Scheduled" | "In Progress" | "Cancelled"
  ) => Promise<void>;
  getSession: (sessionId: string) => Promise<void>;
  updateSession: (
    sessionId: string,
    update: Partial<Session>
  ) => Promise<void>;
  startSession: (sessionId: string) => Promise<void>;
  endSession: (sessionId: string, feedback: string) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
  createSession: (
    therapistId: string,
    startTime: string,
    metadata: Record<string, any>,
    patientId?: string
  ) => Promise<void>;

  fetchPatientsByTherapistId: (therapistId: string) => Promise<void>;
}

export const useTherapistStore = create<TherapistStoreState>()(
  devtools(
    persist(
      (set) => ({
        // Initialize your state
        sessions: [],
        patients: [],
        // Define actions

        // Patients actions
        setPatients: (patients) => set({ patients: patients }),
        fetchPatientsByTherapistId: async (therapistId: string) => {},

        // Sessions actions
        setSessions: (sessions) => set({ sessions: sessions }),
        fetchSessionsByTherapistId: async (therapistId: string, status?: "Completed" | "Scheduled" | "In Progress" | "Cancelled") => {
          try {
            const response = await getAllSessionsByTherapist(therapistId, status);
            if (response && response.status === 200) {
              const data = await response.data.sessions;
              set({ sessions: data });
            }
          } catch (error) {
            throw error;
          }
        },

        getSession: async (sessionId: string) => {
          console.log("Fetching session with ID:", sessionId);
          try {
            const response = await getSession(sessionId);
            if (response && response.status === 200) {
              const data = await response.data.session;
              set((state) => ({
                sessions: state.sessions.map((session) =>
                  session.session_id === sessionId ? data : session
                ),
              }));
            }
          } catch (error) {
            throw error;
          }
        },

        updateSession: async (sessionId: string, update: Partial<Session>) => {
          console.log("Updating session with ID:", sessionId);
          console.log("Update data:", update);
          try {
            const response = await updateSession(sessionId, update);
            if (response && response.status === 200) {
              const data = await response.data.session;
              set((state) => ({
                sessions: state.sessions.map((session) =>
                  session.session_id === sessionId ? data : session
                ),
              }));
            }
          } catch (error) {
            throw error;
          }
        },

        startSession: async (sessionId: string) => {
          console.log("Starting session with ID:", sessionId);
          try {
            const response = await startSession(sessionId);
            if (response && response.status === 200) {
              const data = await response.data.session;
              set((state) => ({
                sessions: state.sessions.map((session) =>
                  session.session_id === sessionId ? data : session
                ),
              }));
            }
          } catch (error) {
            throw error;
          }
        },

        endSession: async (sessionId: string, feedback: string) => {
          console.log("Ending session with ID:", sessionId);
          try {
            const response = await endSession(sessionId, feedback);
            if (response && response.status === 200) {
              const data = await response.data.session;
              set((state) => ({
                sessions: state.sessions.map((session) =>
                  session.session_id === sessionId ? data : session
                ),
              }));
            }
          } catch (error) {
            throw error;
          }
        },

        cancelSession: async (sessionId: string) => {
          console.log("Cancelling session with ID:", sessionId);
          try {
            const response = await cancelSession(sessionId);
            if (response && response.status === 200) {
              const data = await response.data.session;
              set((state) => ({
                sessions: state.sessions.map((session) =>
                  session.session_id === sessionId ? data : session
                ),
              }));
            }
          } catch (error) {
            throw error;
          }
        },

        createSession: async (
          therapistId: string,
          startTime: string,
          metadata: Record<string, any>,
          patientId: string = "1"
        ) => {
          try {
            const response = await createSession(
              patientId,
              therapistId,
              startTime,
              metadata
            );
            if (response && response.status === 200) {
              const data = await response.data.session;
              set((state) => ({
                sessions: [...state.sessions, data],
              }));
            }
          } catch (error) {
            console.error("Error creating session:", error);
          }
        },
      }),
      {
        name: "therapist-store",
      }
    )
  )
);
