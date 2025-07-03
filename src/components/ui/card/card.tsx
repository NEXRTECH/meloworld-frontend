import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
}) => {
  return (
    <div className="relative w-full overflow-hidden border-[1px] border-gray-200 rounded-2xl shadow-lg">
      <div className={clsx("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};


export default Card;
