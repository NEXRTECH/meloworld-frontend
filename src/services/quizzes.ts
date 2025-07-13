import { Question } from "@/components/types";
import { retryFetch } from "@/lib/utils";

const QUIZ_HOST = process.env.NEXT_PUBLIC_AWS_QUIZ_HOST;
const REPORTS_HOST = process.env.NEXT_PUBLIC_AWS_REPORTS_HOST;

export const getAllQuizzesByChapter = async (
  token: string,
  chapterId: string
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz/quiz?action=listQuizzes`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chapter_id: chapterId }),
  };

  const response = await retryFetch(url, options);
  return response;
};

export const getAllQuizzesByCourse = async (
  token: string,
  courseId: string
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz/?action=getAllQuizByCourseId`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_id: courseId }),
  };
  const response = await retryFetch(url, options);
  return response;
};

export const getAllQuestionsByQuizId = async (
  token: string,
  quizId: string
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz/?action=listQuestions`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quiz_id: quizId }),
  };
  const response = await retryFetch(url, options);
  return response;
};

export const getQuizByChapter = async (
  token: string,
  chapterId: string,
  quizId: string,
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz/quiz?action=getQuiz`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chapter_id: chapterId, quiz_id: quizId }),
  };

  const response = await retryFetch(url, options);
  return response;
};

export const updateQuiz = async (
  token: string,
  body: string
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz/quiz?action=updateQuiz`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body,
  };

  const response = await retryFetch(url, options);
  return response;
}

export const fetchNorms = async (token: string) => {
  const url = `https://${REPORTS_HOST}/default/quizSubmission?action=getAllNorms`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const response = await retryFetch(url, options);
  return response;
}

export const createQuiz = async (
  token: string,
  quizData: { chapter_id: string; course_id: string; title: string; description: string; image: string }
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz?action=createQuiz`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  };
  const response = await retryFetch(url, options);
  return response;
};

export const createQuestion = async (
  token: string,
  questionData: Partial<Question>
) => {
  const url = `https://${QUIZ_HOST}/default/psychometricQuiz?action=addQuestion`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  };
  const response = await retryFetch(url, options);
  return response;
};
