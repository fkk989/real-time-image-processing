import React from "react";
import { LogoProps } from "../../lib/types";

export const TurnArrow: React.FC<LogoProps> = ({ className, onClick }) => {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 15-6 6m0 0-6-6m6 6V9a6 6 0 0 1 12 0v3"
      />
    </svg>
  );
};
