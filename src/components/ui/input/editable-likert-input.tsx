import React, { useState } from "react";

interface EditableLikertInputProps {
  name: string;
  value?: Record<number, string>;
  onChange?: (value: Record<number, string>) => void;
  count?: number; // number of scale points, default 5
  defaultLabels?: string[];
}

const DEFAULT_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];
const DEFAULT_COLORS = ["#ff7900", "#ff7900", "#9ca3af", "#024a70", "#024a70"];

const EditableLikertInput: React.FC<EditableLikertInputProps> = ({
  name,
  value,
  onChange,
  count = 5,
  defaultLabels = DEFAULT_LABELS,
}) => {
  // Initialize state from value or default labels
  const initialLabels: Record<number, string> = {};
  for (let i = 1; i <= count; i++) {
    initialLabels[i] = value?.[i] ?? defaultLabels[i - 1] ?? `Option ${i}`;
  }
  const [labels, setLabels] = useState<Record<number, string>>(initialLabels);

  const handleLabelChange = (idx: number, newLabel: string) => {
    const updated = { ...labels, [idx]: newLabel };
    setLabels(updated);
    onChange?.(updated);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      {Array.from({ length: count }, (_, i) => {
        const idx = i + 1;
        const color = count === 5 ? DEFAULT_COLORS[i] : "bg-secondary";
        return (
          <div
            key={idx}
            className="flex flex-row sm:flex-col items-center text-left sm:text-center text-xs font-medium gap-2 sm:gap-0 w-full sm:w-auto"
          >
            <div
              className={
                `w-5 h-5 rounded-full border-2 mb-0 sm:mb-1 transition-all` // mimic the circle
              }
              style={{
                borderColor: color,
                backgroundColor: "transparent",
              }}
            />
            <input
              type="text"
              name={`${name}-label-${idx}`}
              value={labels[idx]}
              onChange={e => handleLabelChange(idx, e.target.value)}
              className="max-w-32 sm:mt-1 sm:max-w-24 text-left sm:text-center border border-transparent focus:border-blue-400 rounded px-1 py-0.5 text-xs bg-transparent outline-none"
              style={{ background: "none" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EditableLikertInput; 