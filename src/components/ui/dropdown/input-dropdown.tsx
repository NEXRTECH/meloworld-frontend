import React, { SelectHTMLAttributes, ReactNode } from "react";

interface Option {
  label: string;
  value: string;
}

interface InputDropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | Option)[];
  icon?: ReactNode;
  visualSize?: "xs" | "sm" | "md" | "lg";
  textSize?: "xs" | "sm" | "base" | "lg";
  primaryColor?: string;
  secondaryColor?: string;
}

const sizeMap: Record<NonNullable<InputDropdownProps["visualSize"]>, string> = {
  xs: "py-1 text-xs",
  sm: "py-1.5 text-sm",
  md: "py-2 text-base",
  lg: "py-3 text-lg",
};

const InputDropdown: React.FC<InputDropdownProps> = ({
  label,
  options,
  icon,
  visualSize = "md",
  textSize = "base",
  primaryColor = "#024a70",
  secondaryColor = "#fde9da",
  className = "",
  value,
  ...props
}) => {
  const hasIcon = !!icon;

  return (
    <div className={`w-full max-w-sm text-${textSize}`}>
      {label && <label className="block mb-1 font-semibold">{label}</label>}

      <div className="relative">
        {hasIcon && (
          <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-3">
            {icon}
          </span>
        )}

        <select
          {...props}
          value={value ?? ""}
          className={`
            w-full
            rounded-xl
            border-2
            bg-transparent
            shadow-lg
            appearance-none
            pr-8
            ${hasIcon ? "pl-10" : "pl-3"}
            ${sizeMap[visualSize]}
            ${className}
          `}
          style={{ borderColor: primaryColor }}
        >
          <option value="" disabled>
            Select
          </option>

          {options.map((opt, index) => {
            const { label, value } =
              typeof opt === "string" ? { label: opt, value: opt } : opt;

            return (
              <option key={index} value={value}>
                {label}
              </option>
            );
          })}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
          ▼
        </span>
      </div>
    </div>
  );
};

export default InputDropdown;
