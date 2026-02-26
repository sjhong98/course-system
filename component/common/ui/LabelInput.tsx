import React from "react";
import Column from "../flexBox/Column";

type LabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function LabelInput({
  label,
  className,
  ...rest
}: LabelInputProps) {
  return (
    <Column gap={6}>
      <label className="text-sm">{label}</label>
      <input
        className={`w-full p-2 border border-neutral-300 outline-none focus:border-neutral-500 rounded-lg ${className ?? ""}`}
        {...rest}
      />
    </Column>
  );
}