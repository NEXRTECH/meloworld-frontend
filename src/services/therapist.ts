import { Session } from "@/components/types";
import { signAndRequest } from "@/lib/aws-axios";

const PATIENT_HOST = process.env.NEXT_PUBLIC_AWS_PATIENT_HOST as string;
const THERAPIST_HOST = process.env.NEXT_PUBLIC_AWS_THERAPIST_HOST as string;
const SESSION_HOST = process.env.NEXT_PUBLIC_AWS_SESSION_HOST as string;

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

export const getPatientById = async (patientId: number) => {
  const response = await signAndRequest(
    "POST",
    {},
    PATIENT_HOST,
    "/default/patientHandlerAPI?action=getPatient",
    { patient_id: patientId }
  );
  return response;
};

export const getTherapistById = async (therapistId: number) => {
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

export const getAssignedPatientsByTherapistId = async (therapistId: number) => {
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
  therapistId: number,
  status?: "Completed" | "Scheduled" | "In Progress" | "Cancelled"
) => {
  const payload = {
    therapist_id: therapistId,
    session_status: status,
    limit: 100,
    offset: 0,
  };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=listSessions",
    payload
  );
  return response;
};

export const createSession = async (
  patientId: number,
  therapistId: number,
  startTime: string,
  metadata: Record<string, any>
) => {
  const payload = {
    patient_id: patientId,
    therapist_id: therapistId,
    start_time: startTime,
    metadata: metadata,
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

export const getSession = async (
  sessionId: number,
) => {
  const payload = {
    session_id: sessionId,
  };
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
  sessionId: number,
  update: Partial<Session>
) => {
  const payload = {
    session_id: sessionId,
    ...update,
  };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=updateSession",
    payload
  );
  return response;
};

export const startSession = async (
  sessionId: number,
) => {
  const payload = {
    session_id: sessionId,
  };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=startSession",
    payload
  );
  return response;
};

export const endSession = async (
  sessionId: number,
  feedback: string,
) => {
  const payload = {
    session_id: sessionId,
    end_time: new Date().toISOString(),
    feedback: feedback,
  };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=completeSession",
    payload
  );
  return response;
};

export const cancelSession = async (
  sessionId: number,
) => {
  const payload = {
    session_id: sessionId,
  };
  const response = await signAndRequest(
    "POST",
    {},
    SESSION_HOST,
    "/default/sessionHandlerAPI?action=cancelSession",
    payload
  );
  return response;
};