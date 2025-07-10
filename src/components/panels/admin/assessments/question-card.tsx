import React, { useState } from "react";
import Card from "../../../ui/card/card";
import { Question, Quiz } from "../../../types";
import Button from "../../../ui/button/button";
import { FiEdit3 } from "react-icons/fi";
import LikertScaleInput from "../../../ui/input/likert-scale-input";
import { motion } from "framer-motion";
import AddQuestionForm from "@/components/forms/add-question";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

interface QuestionCardProps {
  quiz: Quiz;
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ quiz, question }) => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const { chapterId } = useParams();
  return (
    <>
      <div className="relative bg-gradient-to-r from-sky-900 to-sky-900/70 rounded-xl shadow-lg text-secondary p-5 backdrop-blur-lg flex flex-col gap-2">
        <div className="flex justify-end mb-5">
          <Button onClick={() => setShowQuestionForm(true)} size="xs">
            <FiEdit3 />
          </Button>
        </div>
        <p className="font-semibold border-2 rounded-xl p-2 tracking-wider">
          Q. {question.question}
        </p>
        <div className="flex flex-col gap-2 px-10 py-4">
          {/* Single correct type questions */}
          {question.type == "single" && (
            <div className="flex flex-col w-full gap-3">
              <p className="font-semibold">Options</p>
              {(Array.isArray(question.options)
                ? question.options
                : Object.values(question.options)
              ).map((op, id) => (
                <p
                  key={id}
                  className="border-2 border-secondary rounded-xl hover:bg-secondary transition duration-150 ease-in-out hover:text-sky-900 text-center p-2 w-full"
                >
                  {op}
                </p>
              ))}
              <div>
                <p>Correct Answer</p>
                <p className="font-semibold">{question.answer}</p>
              </div>
            </div>
          )}
          {/* Likert Type questions */}
          {question.type == "likert" && (
            <div className="w-full">
              <LikertScaleInput name="asdf" />
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showQuestionForm && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "backInOut" }}
            exit={{ x: "100%", opacity: 0 }}
            className="fixed p-10 z-100 right-0 top-0 h-full w-full lg:w-1/2 bg-secondary shadow-xl"
          >
            <div className="absolute top-0 left-0 bottom-0 text-sky-900 py-5 px-12 w-full">
              <h1>Add Question</h1>
            </div>
            <div className="w-full h-full mt-14 bg-secondary">
              <AddQuestionForm
                question={question}
                isEdit={true}
                quiz={quiz}
                onClose={() => setShowQuestionForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionCard;
