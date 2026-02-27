import React from "react";
import Column from "../flexBox/Column";
import { InvalidResult } from "@/lib/validation/types";

type LabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: InvalidResult | null;
};

export default function LabelInput({
  label,
  className,
  error,
  ...rest
}: LabelInputProps) {
  return (
    <Column gap={6} className="relative">
      <label className="text-sm">{label}</label>
      <input
        className={`w-full p-2 border border-neutral-300 outline-none focus:border-neutral-500 rounded-lg ${className ?? ""}`}
        {...rest}
      />
      {error && error.errors && error.errors?.[rest.name as string] && <p className="text-[12px] text-red-500 absolute bottom-[-18px]">{error.errors[rest.name as string]}</p>}
    </Column>
  );
}