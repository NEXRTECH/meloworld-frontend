import { Organization } from "@/components/types";
import { signAndRequest } from "@/lib/aws-axios";
import { retryFetch } from "@/lib/utils";

const ORG_HOST = process.env.NEXT_PUBLIC_AWS_ORG_HOST!;

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

export const removeCourseFromOrg = async (token: string, orgId: string, courseId: string) => {
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
