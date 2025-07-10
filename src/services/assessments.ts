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

export const createCourse = async (token: string, courseData: { title: string; description?: string, image: string, norm_id: number }
) => {
  const url = `https://${ASSESSMENT_HOST}/default/psychometricCourse/course?action=createCourse`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...courseData,
    }),
  };
  console.debug(options.body);
  const response = await retryFetch(url, options);
  return response;
};

export const deleteCourse = async (token: string, courseId: number) => {
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