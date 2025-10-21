import React, { useState } from "react";
import Input from "../ui/input/input";
import Button from "../ui/button/button";
import { useAuthStore } from "../stores/auth-store";
import { useAdminStore } from "../stores/admin-store";
import TextArea from "../ui/textarea/textarea";
import Select from "../ui/select/select";
import { Norm } from "../types";
import { randomInt } from "crypto";

interface NormData {
  type: string;
  scale_name: string;
  gender: string;
  age_min: number;
  age_max: number;
  description: string;
  norm_thresholds: {
    low_max: number;
    avg_min: number;
    avg_max: number;
    high_min: number;
  };
  interpretations: {
    high: string;
    average: string;
    low: string;
  };
}

const AddNormForm = ({ onClose }: { onClose: () => void }) => {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState<Norm>({
    type: "student",
    scale_name: "",
    normId: Math.floor(Math.random() * 900000) + 100000,
    gender: "all",
    age_min: 19,
    age_max: 60,
    description: "",
    norm_thresholds: {
      low_max: 19,
      avg_min: 20,
      avg_max: 26,
      high_min: 27,
    },
    interpretations: {
      high: "",
      average: "",
      low: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { createNorm } = useAdminStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      norm_thresholds: {
        ...prev.norm_thresholds,
        [name]: Number(value),
      },
    }));
  };

  const handleInterpretationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      interpretations: {
        ...prev.interpretations,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await createNorm(token, formData as Norm, formData.type as string);
      console.log("norm created", formData);
      setMessage("Norm created successfully!");
      onClose();
    } catch (err) {
      setMessage("Failed to create norm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-lg mx-auto mt-20 lg:mt-0 p-4 bg-white rounded-xl shadow h-full"
    >
      <h2 className="text-xl font-semibold text-center">Add New Norm</h2>

      <div className="flex flex-col gap-4 text-sm overflow-y-auto p-2">
        <div className="flex flex-col ">
          <label htmlFor="type" className="font-semibold">
            Norm Type
          </label>
          <Select
            value={formData.type as string}
            onValueChange={handleTypeChange}
            items={[
              { value: "student", label: "Student" },
              { value: "org", label: "Organization" },
            ]}
          />
        </div>

        <div className="flex flex-col ">
          <label htmlFor="scale_name" className="font-semibold">
            Scale Name
          </label>
          <Input
            id="scale_name"
            placeholder="Scale Name"
            name="scale_name"
            value={formData.scale_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col ">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <TextArea
            id="description"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded min-h-[80px]"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className="font-semibold">
              Gender
            </label>
            <Input
              id="gender"
              placeholder="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="age_min" className="font-semibold">
              Min Age
            </label>
            <Input
              id="age_min"
              type="number"
              placeholder="Min Age"
              name="age_min"
              value={formData.age_min}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="age_max" className="font-semibold">
              Max Age
            </label>
            <Input
              id="age_max"
              type="number"
              placeholder="Max Age"
              name="age_max"
              value={formData.age_max}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-2">Norm Thresholds</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="low_max" className="font-semibold">
              Low Max
            </label>
            <Input
              id="low_max"
              type="number"
              placeholder="Low Max"
              name="low_max"
              value={formData.norm_thresholds.low_max}
              onChange={handleThresholdChange}
              required
            />
          </div>
          <div>
            <label htmlFor="avg_min" className="font-semibold">
              Average Min
            </label>
            <Input
              id="avg_min"
              type="number"
              placeholder="Average Min"
              name="avg_min"
              value={formData.norm_thresholds.avg_min}
              onChange={handleThresholdChange}
              required
            />
          </div>
          <div>
            <label htmlFor="avg_max" className="font-semibold">
              Average Max
            </label>
            <Input
              id="avg_max"
              type="number"
              placeholder="Average Max"
              name="avg_max"
              value={formData.norm_thresholds.avg_max}
              onChange={handleThresholdChange}
              required
            />
          </div>
          <div>
            <label htmlFor="high_min" className="font-semibold">
              High Min
            </label>
            <Input
              id="high_min"
              type="number"
              placeholder="High Min"
              name="high_min"
              value={formData.norm_thresholds.high_min}
              onChange={handleThresholdChange}
              required
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-2">Interpretations</h3>

        <div className="flex flex-col ">
          <label htmlFor="high_interpretation" className="font-semibold">
            High Interpretation
          </label>
          <TextArea
            id="high_interpretation"
            placeholder="High Interpretation"
            name="high"
            value={formData.interpretations.high}
            onChange={handleInterpretationChange}
            className="p-2 border rounded min-h-[80px]"
            required
          />
        </div>
        <div className="flex flex-col ">
          <label htmlFor="average_interpretation" className="font-semibold">
            Average Interpretation
          </label>
          <TextArea
            id="average_interpretation"
            placeholder="Average Interpretation"
            name="average"
            value={formData.interpretations.average}
            onChange={handleInterpretationChange}
            className="p-2 border rounded min-h-[80px]"
            required
          />
        </div>
        <div className="flex flex-col ">
          <label htmlFor="low_interpretation" className="font-semibold">
            Low Interpretation
          </label>
          <TextArea
            id="low_interpretation"
            placeholder="Low Interpretation"
            name="low"
            value={formData.interpretations.low}
            onChange={handleInterpretationChange}
            className="p-2 border rounded min-h-[80px]"
            required
          />
        </div>
      </div>

      <div className="mt-auto p-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Norm"}
        </Button>
        {message && <div className="text-center text-sm mt-2">{message}</div>}
      </div>
    </form>
  );
};

export default AddNormForm;
