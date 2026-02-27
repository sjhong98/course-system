import React from "react";

export type ColumnProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  gap?: number;
  ref?: React.RefObject<HTMLDivElement | null>;
};

export default function Column({ children, className, gap = 0, style, ref, ...rest }: ColumnProps) {
  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ gap: `${gap}px`, ...(style) }}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
}