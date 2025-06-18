import { Fieldset } from "@headlessui/react";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Input from "../ui/input/input";
import Button from "../ui/button/button";
import InputDropdown from "../ui/dropdown/input-dropdown";
import LikertScaleInput from "../ui/input/likert-scale-input";
import { Question, Quiz } from "../types";
import { updateQuiz } from "../../services/quizzes";
import { useAuthStore } from "../stores/auth-store";

interface QuestionFormState {
  type: { value: string; error: string };
  question: { value: string; error: string };
  options: { value: string[]; error: string };
  answer: { value: string | number | null; error: string };
}

interface AddEditQuestionFormProps {
  isEdit?: boolean;
  onClose: () => void;
  quizId?: number;
  quiz?: Quiz;
  question?: Question;
}

const AddEditQuestionForm: React.FC<AddEditQuestionFormProps> = ({
  isEdit = false,
  onClose = () => {},
  quizId,
  question = {
    answer: null,
    options: [],
    question: "",
    type: "single"
  },
  quiz,
}) => {
  const { token } = useAuthStore();
  const [formState, setFormState] = useState<QuestionFormState>({
    type: { value: question.type, error: "" },
    question: { value: question.question, error: "" },
    options: { value: question.options, error: "" },
    answer: { value: question.answer, error: "" },
  });

  const updateFormField = <K extends keyof QuestionFormState>(
    key: K,
    value: QuestionFormState[K]["value"]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        error: "",
      },
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...formState.options.value];
    updated[index] = value;
    updateFormField("options", updated);
  };

  const handleAddOption = () => {
    updateFormField("options", [...formState.options.value, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const updated = formState.options.value.filter((_: string, i: number) => i !== index);
    updateFormField("options", updated);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  if(question.type) {

  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="h-full pb-15 px-2 text-sky-900 overflow-auto flex flex-col w-full gap-5"
    >
      <InputDropdown
        visualSize="sm"
        label="Question Type"
        options={["multiple", "likert", "single"]}
        value={formState.type.value}
        onChange={(e) => updateFormField("type", e.target.value)}
      />

      <Fieldset className="w-full flex flex-col gap-2">
        <label htmlFor="question" className="font-semibold">
          Question
        </label>
        <Input
          id="question"
          value={formState.question.value}
          required
          inputSize="sm"
          placeholder="Add your question here"
          onChange={(e) => updateFormField("question", e.target.value)}
        />
      </Fieldset>

      <Fieldset className="w-full flex flex-col gap-2">
        <label className="font-semibold">Options</label>

        {formState.type.value === "likert" ? (
          <LikertScaleInput
            name="likert-response"
            value={typeof formState.answer.value === 'number' ? formState.answer.value : undefined}
            onChange={(value) => updateFormField("answer", value)}
          />
        ) : (
          <>
            {(formState.options.value as string[]).map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  inputSize="sm"
                  placeholder={`Option ${idx + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="transition duration-150 ease-in-out hover:text-red-700 p-1 rounded-full"
                >
                  <RxCross2 size={18} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={handleAddOption}
            >
              Add option
            </Button>
          </>
        )}
      </Fieldset>

      {formState.type.value !== "likert" && (
        <Fieldset className="w-full flex flex-col gap-2">
          <InputDropdown
            visualSize="sm"
            label="Answer"
            options={formState.options.value}
            value={formState.answer.value as string}
            onChange={(e) => updateFormField("answer", e.target.value)}
          />
        </Fieldset>
      )}

      <div className="flex gap-2 items-center">
        <Button className="w-fit" type="submit" size="xs">
          {isEdit ? "Edit" : "Add"}
        </Button>
        <Button type="button" onClick={onClose} variant="outline" size="xs">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddEditQuestionForm;
