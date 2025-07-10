import React from "react";

interface LikertScaleInputProps {
  name: string;
  value?: number;
  options?: string[];
  onChange?: (value: number) => void;
}

const LikertScaleInput: React.FC<LikertScaleInputProps> = ({
  name,
  value,
  options = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  onChange,
}) => {
  // If exactly 5 options are provided, assign the specific colors.
  const defaultColors = ["#ff7900", "#ff7900", "#9ca3af", "#024a70", "#024a70"];
  const scaleOptions = options.map((option, index) => ({
    label: option,
    value: index + 1,
    color: options.length === 5 ? defaultColors[index] : "#9ca3af",
  }));

  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      {scaleOptions.map((option) => (
        <label
          key={option.value}
          className="flex flex-row sm:flex-col items-center text-left sm:text-center text-xs font-medium gap-2 sm:gap-0 w-full sm:w-full"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) =>
              onChange?.(e.target.value ? parseInt(e.target.value) : 0)
            }
            className="sr-only"
          />
          <div
            className={
              `w-5 h-5 rounded-full border-2 mb-0 sm:mb-1 transition-all cursor-pointer ` +
              (value === option.value ? "scale-110" : "opacity-60 hover:opacity-100")
            }
            style={{
              borderColor: option.color,
              backgroundColor:
                value === option.value ? option.color : "transparent",
            }}
            onClick={() => onChange?.(option.value)}
          />
          <span className="sm:mt-1 max-w-24 text-left sm:text-center">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default LikertScaleInput;
