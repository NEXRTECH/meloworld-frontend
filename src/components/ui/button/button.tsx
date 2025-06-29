import React, { ComponentPropsWithoutRef } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  size?: "xs" | "sm" | "md" | "lg";
  primaryColor?: string;
  secondaryColor?: string;
  variant?: "filled" | "outline";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const sizeMap: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const Button: React.FC<ButtonProps> = ({
  className = "",
  size = "md",
  primaryColor = "#024a70",
  secondaryColor = "#ffffff",
  variant = "filled",
  disabled,
  icon,
  children,
  ...props
}) => {
  const isOutline = variant === "outline";
  const isDisabled = !!disabled;

  // Use gray when disabled
  const currentPrimary = isDisabled ? "#d1d5db" : primaryColor;
  const currentSecondary = isDisabled ? "#f9fafb" : secondaryColor;

  const baseStyle = {
    backgroundColor: isOutline || isDisabled ? "transparent" : currentPrimary,
    borderColor: currentPrimary,
    color: isOutline || isDisabled ? currentPrimary : currentSecondary,
    ...(isOutline && !isDisabled && {
      backgroundImage: `linear-gradient(to right, ${currentPrimary}, ${currentPrimary})`,
    }),
  };

  return (
    <motion.button
      disabled={disabled}
      initial={
        isOutline && !isDisabled
          ? { backgroundSize: "0% 100%", color: currentPrimary }
          : undefined
      }
      whileHover={
        isOutline && !isDisabled
          ? {
              backgroundSize: "100% 100%",
              color: currentSecondary,
            }
          : undefined
      }
      transition={
        isOutline && !isDisabled ? { duration: 0.1, ease: "easeInOut" } : undefined
      }
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      style={baseStyle}
      className={`
        ${sizeMap[size]}
        relative
        flex gap-2
        justify-center
        items-center
        text-${size}
        overflow-hidden
        px-2 lg:px-5 py-2
        font-semibold
        min-h-max
        shadow-lg
        rounded-xl
        border-2
        ${isOutline || isDisabled ? "bg-no-repeat bg-left bg-[length:0%_100%]" : ""}
        transition-all duration-300
        cursor-${isDisabled ? "not-allowed" : "pointer"}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
