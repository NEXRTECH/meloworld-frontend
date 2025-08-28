import { Organization } from "@/components/types";
import { signAndRequest } from "@/lib/aws-axios";
import { retryFetch } from "@/lib/utils";

const ORG_HOST = process.env.NEXT_PUBLIC_AWS_ORG_HOST!;
const REPORT_HOST = process.env.NEXT_PUBLIC_AWS_REPORTS_HOST!;

export const updateOrganization = async (
  orgId: string,
  update: Partial<Organization>
) => {
  const payload = {
    organization_id: orgId,
    ...update,
  };

  const response = await signAndRequest(
    "POST",
    {},
    ORG_HOST,
    "/default/orgHandlerAPI?action=updateOrganization",
    payload
  );

  return response;
};

export const getAllOrganizations = async () => {
  const response = await signAndRequest(
    "POST",
    {},
    ORG_HOST,
    "/default/orgHandlerAPI?action=getAllOrganizations",
    {}
  );

  return response;
};

export const getOrganizationById = async (orgId: string) => {
  const payload = {
    organization_id: orgId,
  };

  const response = await signAndRequest(
    "POST",
    {},
    ORG_HOST,
    "default/orgHandlerAPI?action=getOrganization",
    payload
  );

  return response;
};

export const getAssignedCourses = async (orgId: string) => {
  const payload = {
    organization_id: orgId,
  };

  const response = await signAndRequest(
    "POST",
    {},
    ORG_HOST,
    "/default/orgHandlerAPI?action=getAssignedCourses",
    payload
  );

  return response;
};

export const assignCourseToOrg = async (
  token: string,
  orgId: string,
  courseId: string
) => {
  const payload = {
    organization_id: orgId,
    course_id: courseId,
  };

  const response = await signAndRequest(
    "POST",
    { token: `Bearer ${token}` },
    ORG_HOST,
    "/default/orgHandlerAPI?action=assignCourseToOrganization",
    payload
  );

  return response;
};

export const removeCourseFromOrg = async (
  token: string,
  orgId: string,
  courseId: string
) => {
  const payload = {
    organization_id: orgId,
    course_id: courseId,
  };

  const response = await signAndRequest(
    "POST",
    { token: `Bearer ${token}` },
    ORG_HOST,
    "/default/orgHandlerAPI?action=unassignCourseFromOrganization",
    payload
  );

  return response;
};

export const getOrgEmployees = async (token: string, orgId: string) => {
  const payload = {
    organization_id: orgId,
  };

  const response = await signAndRequest(
    "POST",
    {},
    ORG_HOST,
    "/default/orgHandlerAPI?action=getOrganizationUsers",
    payload
  );

  return response;
};

export const getOrgReports = async (orgId: string, token: string) => {
  const url = `https://${REPORT_HOST}/default/quizSubmission?action=getOrgReport`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const response = await retryFetch(url, options);
  return response;
};

export const getOrgReportsPct = async (
  orgId: string,
  courseId: string,
  token: string
) => {
  const url = `https://${REPORT_HOST}/default/quizSubmission?action=getOrgHighPctByChapter`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organization_id: orgId,
      course_id: courseId,
    }),
  };

  const response = await retryFetch(url, options);
  return response;
};

export const getOrgReportsAvgVsOthers = async (token: string, courseId: string) => {
  const url = `https://${REPORT_HOST}/default/quizSubmission?action=getOrgVsOthersChapterAvg`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_id: courseId,
    }),
  };

  const response = await retryFetch(url, options);
  return response;
};
