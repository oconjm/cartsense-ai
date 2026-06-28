import React from "react";

interface RoundedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const RoundedButton = React.forwardRef<
  HTMLButtonElement,
  RoundedButtonProps
>(({ children, className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={`
        rounded-xl
        px-4
        py-2
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </button>
  );
});

RoundedButton.displayName = "RoundedButton";
