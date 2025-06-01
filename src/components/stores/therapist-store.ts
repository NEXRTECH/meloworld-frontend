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
    therapistId: number,
    status?: "Completed" | "Scheduled"
  ) => Promise<void>;
  getSession: (sessionId: number) => Promise<void>;
  updateSession: (
    sessionIdd: number,
    update: Partial<Session>
  ) => Promise<void>;
  startSession: (sessionId: number) => Promise<void>;
  endSession: (sessionId: number, feedback: string) => Promise<void>;
  cancelSession: (sessionId: number) => Promise<void>;
  createSession: (
    therapistId: number,
    startTime: string,
    metadata: Record<string, any>,
    patientId?: number
  ) => Promise<void>;

  fetchPatientsByTherapistId: (therapistId: number) => Promise<void>;
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
        fetchPatientsByTherapistId: async (therapistId: number) => {},

        // Sessions actions
        setSessions: (sessions) => set({ sessions: sessions }),
        fetchSessionsByTherapistId: async (therapistId: number) => {
          try {
            const response = await getAllSessionsByTherapist(therapistId);
            if (response && response.status === 200) {
              const data = await response.data.sessions;
              set({ sessions: data });
            }
          } catch (error) {
            throw error;
          }
        },

        getSession: async (sessionId: number) => {
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

        updateSession: async (sessionId: number, update: Partial<Session>) => {
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

        startSession: async (sessionId: number) => {
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

        endSession: async (sessionId: number, feedback: string) => {
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

        cancelSession: async (sessionId: number) => {
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
          therapistId: number,
          startTime: string,
          metadata: Record<string, any>,
          patientId: number = 1
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
