import { Organization } from "@/components/types";
import { signAndRequest } from "@/lib/aws-axios";
import { retryFetch } from "@/lib/utils";

const ORG_HOST = process.env.NEXT_PUBLIC_AWS_ORG_HOST!;

export const updateOrganization = async (
  orgId: number,
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
    "GET",
    {},
    ORG_HOST,
    "/default/orgHandlerAPI?action=getAllOrganizations",
  );

  return response;
};

export const getOrganizationById = async (orgId: number) => {
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
