import { retryFetch } from "@/lib/utils";

const ASSESSMENT_HOST = process.env.NEXT_PUBLIC_AWS_ASSESSMENT_HOST;

export const getAllAssessments = async (token: string) => {
    const url = `https://${ASSESSMENT_HOST}/default/psychometricCourse/course?action=listCourses`
  const options = {
    method: 'POST',
    headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: undefined
  }

  const response = await retryFetch(url, options);
  return response;
};

export const createAssessment = async (
  token: string,
  assessmentData: { title: string; description?: string }
) => {
  const url = `https://${ASSESSMENT_HOST}/default/psychometricCourse/course`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "createCourse",
      ...assessmentData,
    }),
  };

  const response = await retryFetch(url, options);
  return response;
};
