"use client";

import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaPlus, FaChevronLeft, FaChevronRight, FaPenToSquare, FaFloppyDisk, FaXmark, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/components/stores/auth-store";
import { Chapter, Quiz } from "@/components/types";
import { getChapterById } from "@/services/chapters";
import { getAllQuizzesByChapter } from "@/services/quizzes";
import Button from "@/components/ui/button/button";
import Dropdown from "@/components/ui/dropdown/dropdown";
import QuestionCard from "@/components/panels/admin/assessments/question-card";
import AddQuestionForm from "@/components/forms/add-question";
import { useParams, useRouter } from "next/navigation";
import { useAdminStore } from "@/components/stores/admin-store";
import AddEditQuestionForm from "@/components/forms/add-question";

const ChapterPanel: React.FC = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { assessmentId, chapterId } = useParams();
  const { getQuizzesByCourse, getQuestionsByQuiz } = useAdminStore();
  const chapterByCourse = useAdminStore((state) => state.chaptersByCourse);
  const quizzes = useAdminStore((state) => state.quizzes);
  const chapterQuizzes = quizzes.filter(q => q.chapter_id === Number(chapterId));
  const questions = useAdminStore((state) => state.questions);
  
  const chapter = chapterByCourse[Number(assessmentId)]?.find(ch => ch.id === Number(chapterId));
  
  const [showQuestionForm, setShowQuestionForm] = useState<{
    active: boolean;
    isEdit?: boolean;
    quiz?: Quiz;
  }>({
    active: false,
    isEdit: false,
  });
  
  // Quiz dropdown state
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState<Record<number, number>>({});
  
  // Loading state for quizzes
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  
  // Editable state management for chapter
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (token && assessmentId) {
      setIsLoadingQuizzes(true);
      getQuizzesByCourse(token, Number(assessmentId))
        .finally(() => setIsLoadingQuizzes(false));
    }
  }, [token, assessmentId, getQuizzesByCourse]);

  // Initialize editable values when chapter loads
  useEffect(() => {
    if (chapter) {
      setEditedTitle(chapter.title || "");
      setEditedDescription(chapter.description || "");
    }
  }, [chapter]);

  // Load questions for each quiz when quizzes are loaded
  useEffect(() => {
    if (token && quizzes.length > 0) {
      quizzes.forEach(quiz => {
        getQuestionsByQuiz(token, quiz.id);
      });
    }
  }, [token, quizzes, getQuestionsByQuiz]);

  const handleNextQuestion = (quizId: number) => {
    const quizQuestions = questions[quizId] || [];
    const currentIndex = currentQuestionIndices[quizId] || 0;
    
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [quizId]: currentIndex + 1
      }));
    }
  };

  const handlePreviousQuestion = (quizId: number) => {
    const currentIndex = currentQuestionIndices[quizId] || 0;
    
    if (currentIndex > 0) {
      setCurrentQuestionIndices(prev => ({
        ...prev,
        [quizId]: currentIndex - 1
      }));
    }
  };

  // Title editing handlers
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    // TODO: Integrate with store to save the title
    console.log("Saving title:", editedTitle);
    setIsEditingTitle(false);
  };

  // Description editing handlers
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionBlur = () => {
    // TODO: Integrate with store to save the description
    console.log("Saving description:", editedDescription);
    setIsEditingDescription(false);
  };

  // Show loading state if chapter is not loaded yet
  if (!chapter) {
    return (
      <div className="dashboard-panel relative h-full w-full flex flex-col gap-5 items-start justify-start">
        <Button
          onClick={() => router.push("/admin/assessments")}
          size="xs"
          className="flex gap-2 items-center justify-center mb-5"
        >
          <FaAngleLeft />
          <p className="mt-0.5">Back</p>
        </Button>
        <div className="flex items-center justify-center w-full h-64">
          <div className="text-center">
            <p>Loading chapter...</p>
            <p className="text-sm text-gray-500">Assessment ID: {assessmentId}, Chapter ID: {chapterId}</p>
            <p className="text-sm text-gray-500">Token: {token ? "Present" : "Missing"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel mt-10 lg:mt-0 relative h-full w-full flex flex-col gap-5 items-start justify-start">
      <Button
        onClick={() => router.push("/admin/assessments")}
        size="xs"
        className="flex gap-2 items-center justify-center mb-5"
      >
        <FaAngleLeft />
        <p className="mt-0.5">Back</p>
      </Button>
      
      {/* Editable Title Section */}
      <div className="w-full">
        <div className="group relative">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="text-2xl font-bold bg-white border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
              autoFocus
            />
          ) : (
            <div 
              onClick={handleTitleClick}
              className="group cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -ml-2 transition-colors duration-200 flex items-center gap-2"
            >
              <h1 className="text-2xl font-bold">{chapter?.title}</h1>
              <FaPenToSquare className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm" />
            </div>
          )}
        </div>
        <div className="flex text-xs gap-2 items-start mt-2">
          <p>
            {new Date(chapter?.created_at as string).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </p>
        </div>
      </div>

      {/* Editable Description Section */}
      <div className="w-full">
        <div className="group relative">
          {isEditingDescription ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="text-sm bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full min-h-[60px] resize-y"
              placeholder="Enter chapter description..."
              autoFocus
            />
          ) : (
            <div 
              onClick={handleDescriptionClick}
              className="group cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -ml-2 transition-colors duration-200 flex items-start gap-2"
            >
              <p className="text-sm flex-1">{chapter?.description || "No description"}</p>
              <FaPenToSquare className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm mt-0.5 flex-shrink-0" />
            </div>
          )}
        </div>
      </div>

      <div className="h-0.5 w-full bg-secondary" />
      
      {/* Quizzes Section */}
      <div className="relative w-full flex-col flex gap-2">
        <h2>Quizzes</h2>
        <div className="flex flex-col gap-4 items-center justify-center w-full">
          {isLoadingQuizzes ? (
            <div className="flex flex-col gap-3 items-center justify-center w-full text-center py-8">
              <CgSpinner className="animate-spin text-2xl text-sky-900" />
              <p className="text-gray-500">Loading quizzes...</p>
            </div>
          ) : chapterQuizzes && chapterQuizzes.length > 0 ? (
            <div className="w-full max-w-4xl space-y-4">
              {chapterQuizzes.map((quiz) => {
                const quizQuestions = questions[quiz.id] || [];
                const currentQuestionIndex = currentQuestionIndices[quiz.id] || 0;
                
                return (
                  <Dropdown key={quiz.id} title={`${quiz.title} (${quizQuestions.length} questions)`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Button
                        onClick={() => setShowQuestionForm({ active: true, isEdit: false, quiz: quiz })}
                        size="xs"
                        className="flex gap-2 items-center"
                      >
                        <FaPlus /> Add Question
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-4">{quiz.description || "No description"}</p>
                      
                      {quizQuestions.length > 0 ? (
                        <div className="space-y-4">
                          {/* Question Counter */}
                          <div className="flex justify-center">
                            <p className="text-sm text-gray-600">
                              Question {currentQuestionIndex + 1} of {quizQuestions.length}
                            </p>
                          </div>
                          
                          {/* Question Display */}
                          <div className="relative">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`${quiz.id}-${currentQuestionIndex}`}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full"
                              >
                                <QuestionCard quiz={quiz} question={quizQuestions[currentQuestionIndex]} />
                              </motion.div>
                            </AnimatePresence>
                            
                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-6">
                              <Button
                                onClick={() => handlePreviousQuestion(quiz.id)}
                                disabled={currentQuestionIndex === 0}
                                size="sm"
                                className="flex gap-2 items-center"
                                variant="outline"
                              >
                                <FaChevronLeft />
                                Previous
                              </Button>
                              
                              <Button
                                onClick={() => handleNextQuestion(quiz.id)}
                                disabled={currentQuestionIndex === quizQuestions.length - 1}
                                size="sm"
                                className="flex gap-2 items-center"
                                variant="outline"
                              >
                                Next
                                <FaChevronRight />
                              </Button>
                            </div>
                            
                            {/* Question Dots Indicator */}
                            <div className="flex justify-center mt-4 gap-2">
                              {quizQuestions.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentQuestionIndices(prev => ({
                                    ...prev,
                                    [quiz.id]: index
                                  }))}
                                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    index === currentQuestionIndex
                                      ? "bg-sky-900 scale-110"
                                      : "bg-gray-300 hover:bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 items-center justify-center text-center py-8">
                          <p className="text-gray-500">No questions added yet</p>
                          <Button
                            onClick={() => setShowQuestionForm({ active: true, isEdit: false, quiz: quiz })}
                            size="xs"
                            className="flex gap-2 items-center"
                          >
                            <FaPlus /> Add Question
                          </Button>
                        </div>
                      )}
                    </div>
                  </Dropdown>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center w-full text-center py-8">
              <p className="text-gray-500">No quizzes added yet</p>
              <Button
                onClick={() => setShowQuestionForm({ active: true, isEdit: false })}
                size="xs"
                className="flex gap-2 items-center"
              >
                <FaPlus /> Add Quiz
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showQuestionForm.active && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "backInOut" }}
            exit={{ x: "100%", opacity: 0 }}
            className="fixed p-10 right-0 top-0 h-full w-full lg:w-1/2 bg-secondary shadow-xl"
          >
            <div className="absolute top-0 left-0 text-sky-900 py-5 px-12 w-full">
              <h1>Add Question</h1>
            </div>
            <div className="w-full h-full mt-14">
              <AddEditQuestionForm
                quizId={showQuestionForm.quiz?.id || 0}
                quiz={showQuestionForm.quiz}
                onClose={() => setShowQuestionForm({ active: false, isEdit: false })}
                isEdit={showQuestionForm.isEdit}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChapterPanel;
