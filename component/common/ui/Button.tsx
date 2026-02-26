import { cn } from "@/lib/utils/cn";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        `w-full p-2 text-white rounded-lg transition-all duration-100`,
        className,
        rest.disabled ? "opacity-50 cursor-normal bg-neutral-300" : "cursor-pointer bg-neutral-700 active:bg-neutral-800 active:scale-98",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}