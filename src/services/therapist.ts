import { Session } from "@/components/types";
import { signAndRequest } from "@/lib/aws-axios";

const PATIENT_HOST = process.env.NEXT_PUBLIC_AWS_PATIENT_HOST!;
const THERAPIST_HOST = process.env.NEXT_PUBLIC_AWS_THERAPIST_HOST!;
const SESSION_HOST = process.env.NEXT_PUBLIC_AWS_SESSION_HOST!;

export const loginTherapist = async (email: string, password: string) => {
  const response = await signAndRequest(
    "POST",
    {},
    THERAPIST_HOST,
    "/default/therapistHandlerAPI?action=loginTherapist",
    { email: email, password: password }
  );
  return response;
};

export const getPatientById = async (patientId: string) => {
  const response = await signAndRequest(
    "POST",
    {},
    PATIENT_HOST,
    "/default/patientHandlerAPI?action=getPatient",
    { patient_id: patientId }
  );
  return response;
};

export const getTherapistById = async (therapistId: string) => {
  const payload = { therapist_id: therapistId };
  const response = await signAndRequest(
    "POST",
    {},
    THERAPIST_HOST,
    "/default/therapistHandlerAPI?action=getTherapistProfile",
    payload
  );
  return response;
};

export const getAssignedPatientsByTherapistId = async (therapistId: string) => {
  const payload = { therapist_id: therapistId };
  const response = await signAndRequest(
    "POST",
    {},
    THERAPIST_HOST,
    "/default/therapistHandlerAPI?action=getAssignedPatients",
    payload
  );
  return response;
};

export const getAllSessionsByTherapist = async (
  therapistId: string,
  status?: "Completed" | "Scheduled" | "In Progress" | "Cancelled"
) => {
  const payload = { therapist_id: therapistId, status };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=getSessionsByTherapist",
    payload
  );
  return response;
};

export const createSession = async (
  patientId: string,
  therapistId: string,
  startTime: string,
  metadata: Record<string, any>
) => {
  const payload = {
    patient_id: patientId,
    therapist_id: therapistId,
    start_time: startTime,
    metadata,
  };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=createSession",
    payload
  );
  return response;
};

export const getSession = async (sessionId: string) => {
  const payload = { session_id: sessionId };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=getSession",
    payload
  );
  return response;
};

export const updateSession = async (
  sessionId: string,
  update: Record<string, any>
) => {
  const payload = { session_id: sessionId, ...update };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=updateSession",
    payload
  );
  return response;
};

export const startSession = async (sessionId: string) => {
  const payload = { session_id: sessionId };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=startSession",
    payload
  );
  return response;
};

export const endSession = async (sessionId: string, feedback: string) => {
  const payload = { session_id: sessionId, feedback };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=endSession",
    payload
  );
  return response;
};

export const cancelSession = async (sessionId: string) => {
  const payload = { session_id: sessionId };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=cancelSession",
    payload
  );
  return response;
};