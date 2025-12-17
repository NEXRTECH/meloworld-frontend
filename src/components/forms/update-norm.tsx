"use client";

import React, { useState } from "react";
import Input from "../ui/input/input";
import Button from "../ui/button/button";
import TextArea from "../ui/textarea/textarea";
import Select from "../ui/select/select";
import { useAuthStore } from "../stores/auth-store";
import { useAdminStore } from "../stores/admin-store";
import { Norm } from "../types";

interface Props {
  existingNorm: Norm;
  onClose: () => void;
}

const UpdateNormForm: React.FC<Props> = ({ existingNorm, onClose }) => {
  const { token } = useAuthStore();
  const { updateNorm } = useAdminStore();

  const [formData, setFormData] = useState<Norm>({
    ...existingNorm,
    normId: existingNorm.normId,
    norm_thresholds: {
      low_max: existingNorm.norm_thresholds?.low_max ?? 0,
      avg_min: existingNorm.norm_thresholds?.avg_min ?? 0,
      avg_max: existingNorm.norm_thresholds?.avg_max ?? 0,
      high_min: existingNorm.norm_thresholds?.high_min ?? 0,
    },
    interpretations: {
      high: existingNorm.interpretations?.high ?? "",
      average: existingNorm.interpretations?.average ?? "",
      low: existingNorm.interpretations?.low ?? "",
    },
    recommendations: {
      high: existingNorm.recommendations?.high ?? "",
      average: existingNorm.recommendations?.average ?? "",
      low: existingNorm.recommendations?.low ?? "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /* ---------- HANDLERS ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((p) => ({ ...p, type: value }));
  };

  const handleThresholdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      norm_thresholds: {
        ...p.norm_thresholds,
        [name]: Number(value),
      },
    }));
  };

  const handleNestedChange =
    (key: "interpretations" | "recommendations") =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((p) => ({
        ...p,
        [key]: {
          ...p[key],
          [name]: value,
        },
      }));
    };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      setMessage(null);
      await updateNorm(token, formData, formData.type as string);
      setMessage("✅ Norm updated successfully");
    } catch {
      setMessage("❌ Failed to update norm");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">

      {/* ===== SCROLL BODY ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50">

        {/* BASIC INFO */}
        <section className="bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>

          <Select
            value={formData.type as string}
            onValueChange={handleTypeChange}
            items={[
              { value: "student", label: "Student" },
              { value: "org", label: "Organization" },
            ]}
          />

          <Input
            name="scale_name"
            value={formData.scale_name}
            onChange={handleChange}
            placeholder="Update Scale name"
          />

          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="min-h-[100px] min-w-[100%]"
            placeholder="Update Description"
          />
        </section>

        {/* DEMOGRAPHICS */}
        <section className="bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold">Demographics</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input name="gender" value={formData.gender} onChange={handleChange} />
            <Input type="number" name="age_min" value={formData.age_min} onChange={handleChange} />
            <Input type="number" name="age_max" value={formData.age_max} onChange={handleChange} />
          </div>
        </section>

        {/* THRESHOLDS */}
        <section className="bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold">Thresholds</h3>

          <div className="grid grid-cols-2 gap-3">
            <Input name="low_max" type="number" value={formData.norm_thresholds.low_max} onChange={handleThresholdChange} />
            <Input name="avg_min" type="number" value={formData.norm_thresholds.avg_min} onChange={handleThresholdChange} />
            <Input name="avg_max" type="number" value={formData.norm_thresholds.avg_max} onChange={handleThresholdChange} />
            <Input name="high_min" type="number" value={formData.norm_thresholds.high_min} onChange={handleThresholdChange} />
          </div>
        </section>

        {/* INTERPRETATIONS */}
        <section className="bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold">Interpretations</h3>

          <TextArea
            name="high"
            value={formData.interpretations.high}
            onChange={handleNestedChange("interpretations")}
            className="min-h-[90px] min-w-[100%]"
            placeholder="Update High interpretation"
          />
          <TextArea
            name="average"
            value={formData.interpretations.average}
            onChange={handleNestedChange("interpretations")}
            className="min-h-[90px] min-w-[100%]"
            placeholder="Update Average interpretation"
          />
          <TextArea
            name="low"
            value={formData.interpretations.low}
            onChange={handleNestedChange("interpretations")}
            className="min-h-[90px] min-w-[100%]"
            placeholder="Update Low interpretation"
          />
        </section>

        {/* RECOMMENDATIONS */}
        <section className="bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold">Recommendations</h3>

          <TextArea
            name="high"
            value={formData.recommendations.high}
            onChange={handleNestedChange("recommendations")}
            className="min-h-[90px] min-w-[100%]"
            placeholder="Update High recommendation"
          />
          <TextArea
            name="average"
            value={formData.recommendations.average}
            onChange={handleNestedChange("recommendations")}
            className="min-h-[90px] min-w-[100%]"
            placeholder="Update Average recommendation"
          />
          <TextArea
            name="low"
            value={formData.recommendations.low}
            onChange={handleNestedChange("recommendations")}
            className="min-h-[90px] min-w-[100%]"
            placeholder="Update Low recommendation"
          />
        </section>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4 space-y-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Norm"}
        </Button>

        {message && (
          <p className="text-center text-sm font-medium">{message}</p>
        )}
      </div>
    </form>
  );
};

export default UpdateNormForm;
