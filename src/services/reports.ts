import { retryFetch } from "@/lib/utils";

const REPORTS_HOST = process.env.NEXT_PUBLIC_AWS_REPORTS_HOST;

export const submitSingleAnswer = async (
  token: string,
  courseId: string,
  chapterId: string,
  quizId: string,
  questionId: string,
  selectedOption: number,
  score: number
) => {
  const url = `https://${REPORTS_HOST}/default/quizSubmission?action=submitSingle`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_id: courseId,
      chapter_id: chapterId,
      quiz_id: quizId,
      question_id: questionId,
      selected_option: selectedOption,
      score: score
    }),
  };

  const response = await retryFetch(url, options);
  return response;
};

export const fetchCourseReport = async (
  token: string,
  courseId: string,
) => {
  const url = `https://${REPORTS_HOST}/default/quizSubmission?action=getReportByCourse`;
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

export const fetchSubmissions = async (
  token: string,
  courseId: string,
) => {
  const url = `https://${REPORTS_HOST}/default/quizSubmission?action=getSubmissions`;
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