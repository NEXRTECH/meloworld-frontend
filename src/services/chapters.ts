import { Chapter } from "@/components/types";
import { retryFetch } from "@/lib/utils";

const CHAPTERS_HOST = process.env.NEXT_PUBLIC_AWS_CHAPTER_HOST;

export const getAllChapters = async (token: string, assessmentId: string) => {
  const url = `https://${CHAPTERS_HOST}/default/psychometricChapter/chapter?action=listChapters`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_id: assessmentId }),
  };

  const response = await retryFetch(url, options);
  return response;
};

export const getChapterById = async (
  token: string,
  assessmentId: string,
  chapterId: string
) => {
  const url = `https://${CHAPTERS_HOST}/default/psychometricChapter/chapter?action=getChapter`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_id: assessmentId, chapter_id: chapterId }),
  };

  const response = await retryFetch(url, options);
  return response;
};

export const updateChapterOnServer = async (token: string, chapterId: string, courseId: string, updatedChapter: Partial<Chapter>) => {
  const url = `https://${CHAPTERS_HOST}/default/psychometricChapter/chapter?action=updateChapter`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_id: courseId, chapter_id: chapterId, ...updatedChapter }),
  };

  console.log(options.body)

  const response = await retryFetch(url, options);
  return response;
}

export const createChapter = async (token: string, { course_id, title, chapter_order, image, description, norm_id }: { course_id: string, title: string, chapter_order: number, image: string, description: string, norm_id: string }) => {
  const url = `https://${CHAPTERS_HOST}/default/psychometricChapter/chapter?action=createChapter`;
  console.log(JSON.stringify({ course_id, title, chapter_order, image, description, norm_id }));
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_id, title, chapter_order, image, description, norm_id }),
  };

  const response = await retryFetch(url, options);
  return response;
}