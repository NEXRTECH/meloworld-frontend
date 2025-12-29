import { Fieldset } from "@headlessui/react";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Input from "../ui/input/input";
import Button from "../ui/button/button";
import InputDropdown from "../ui/dropdown/input-dropdown";
import { Question, Quiz } from "../types";
import { useAuthStore } from "../stores/auth-store";
import { useAdminStore } from "../stores/admin-store";
import { useToast } from "../hooks/use-toast";
import EditableLikertInput from "../ui/input/editable-likert-input";

interface QuestionFormState {
  type: { value: string; error: string };
  question: { value: string; error: string };
  options: { value: string[] | Record<number, string>; error: string };
  answer: { value: string; error: string };
}

interface AddEditQuestionFormProps {
  isEdit?: boolean;
  onClose: () => void;
  quizId?: string;
  quiz?: Quiz;
  question?: Question;
}

const AddEditQuestionForm: React.FC<AddEditQuestionFormProps> = ({
  isEdit = false,
  onClose,
  quiz,
  question = {
    answer: "",
    options: [],
    question: "",
    type: "single",
  },
}) => {
  const { token } = useAuthStore();
  const { toast } = useToast();
  const { createQuestion } = useAdminStore();
  const [loading, setLoading] = useState(false);

  const getInitialOptions = () => {
    if (question.type === "likert" && Array.isArray(question.options)) {
      const initial: Record<number, string> = {};
      question.options.forEach((option, index) => {
        initial[index + 1] = option;
      });
      return initial;
    }
    return Array.isArray(question.options) ? question.options : [];
  };

  const [formState, setFormState] = useState<QuestionFormState>({
    type: { value: question.type, error: "" },
    question: { value: question.question, error: "" },
    options: { value: getInitialOptions(), error: "" },
    answer: { value: String(question.answer ?? ""), error: "" },
  });

  const updateFormField = (key: keyof QuestionFormState, value: any) => {
    setFormState((prev) => {
      const updated = {
        ...prev,
        [key]: { value, error: "" },
      };

      if (key === "type") {
        if (value === "likert") {
          updated.options.value = {
            1: "Strongly Disagree",
            2: "Disagree",
            3: "Neutral",
            4: "Agree",
            5: "Strongly Agree",
          };
        } else {
          updated.options.value = [];
        }
        updated.answer.value = "";
      }

      return updated;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Please login",
        description: "You must be logged in",
        variant: "error",
      });
      return;
    }

    setLoading(true);

    const payload: Partial<Question> = {
      question: formState.question.value,
      type: formState.type.value as "single" | "multiple" | "likert",
      options: formState.options.value,
      answer: formState.answer.value,
      quiz_id: quiz?.id,
      chapter_id: quiz?.chapter_id,
    };

    createQuestion(token, payload)
      .then(() => {
        toast({
          title: "Question added",
          description: "Question created successfully",
          variant: "success",
        });
        onClose();
      })
      .catch((err: Error) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="h-full pb-15 px-2 overflow-auto flex flex-col gap-5"
    >
      <InputDropdown
        visualSize="sm"
        label="Question Type"
        options={["multiple", "likert", "single"]}
        value={formState.type.value}
        onChange={(e) => updateFormField("type", e.target.value)}
      />

      <Fieldset className="flex flex-col gap-2">
        <label className="font-semibold">Question</label>
        <Input
          inputSize="sm"
          value={formState.question.value}
          required
          onChange={(e) => updateFormField("question", e.target.value)}
        />
      </Fieldset>

      <Fieldset className="flex flex-col gap-2">
        <label className="font-semibold">Options</label>

        {formState.type.value === "likert" ? (
          <EditableLikertInput
            name="likert-options"
            value={formState.options.value as Record<number, string>}
            onChange={(v) => updateFormField("options", v)}
          />

        ) : (
          <>
            {(formState.options.value as string[]).map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  inputSize="sm"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...(formState.options.value as string[])];
                    updated[idx] = e.target.value;
                    updateFormField("options", updated);
                  }}
                />
                <button onClick={() => {
                  const filtered = (formState.options.value as string[]).filter(
                    (_, i) => i !== idx
                  );
                  updateFormField("options", filtered);
                }}>
                  <RxCross2 />
                </button>
              </div>
            ))}
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() =>
                updateFormField("options", [
                  ...(formState.options.value as string[]),
                  "",
                ])
              }
            >
              Add option
            </Button>
          </>
        )}
      </Fieldset>

      {formState.type.value !== "likert" && (
        <InputDropdown
          label="Answer"
          visualSize="sm"
          options={formState.options.value as string[]}
          value={formState.answer.value}
          onChange={(e) => updateFormField("answer", e.target.value)}
        />
      )}

      <div className="flex gap-2">
        <Button type="submit" size="xs" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Edit" : "Add"}
        </Button>
        <Button type="button" size="xs" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddEditQuestionForm;
