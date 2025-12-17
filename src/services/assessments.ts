import { Course, Norm } from "@/components/types";
import { retryFetch } from "@/lib/utils";

const ASSESSMENT_HOST = process.env.NEXT_PUBLIC_AWS_ASSESSMENT_HOST;
const NORM_HOST = process.env.NEXT_PUBLIC_AWS_NORM_HOST;


export const getAllAssessments = async (token: string) => {
  const url = `https://${ASSESSMENT_HOST}/default/psychometricCourse/course?action=listCourses`;
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

export const createCourse = async (token: string, courseData: { title: string; description?: string, image: string, norm_id: number, type: string }
) => {
  const body = {...courseData, corporate: courseData.type === "corporate"}
  const url = `https://${ASSESSMENT_HOST}/default/psychometricCourse/course?action=createCourse`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  console.log(body)

  const response = await retryFetch(url, options);
  return response;
};

export const deleteCourse = async (token: string, courseId: string) => {
  const url = `https://${ASSESSMENT_HOST}/default/psychometricCourse/course?action=deleteCourse`;
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

export const createNorm = async (token: string, normData: Norm, type: string) => {
  const url = `https://${NORM_HOST}/default/norms?action=createNorm&type=${type}`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normData),
  };
  const response = await retryFetch(url, options);
  return response;
}
// export const updateNorm = async (token: string, normData: Norm, type: string) => {
//   const url = `https://${NORM_HOST}/default/norms?action=updateNorm&type=${type}`;
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(normData),
//   };
//   const response = await retryFetch(url, options);
//   return response;
// }

export const updateNorm = async (token: string, normId: number, normData: any, type: string) => {
  const url = `https://${NORM_HOST}/default/norms?action=updateNorm&type=${type}&normId=${normId}`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normData),
  };
  return await retryFetch(url, options);
};
