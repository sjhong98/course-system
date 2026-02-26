import React from "react";

export type ColumnProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  gap?: number;
};

export default function Column({ children, className, gap, ...rest }: ColumnProps) {
  return (
    <div className={`flex flex-col ${className ?? ""}`} style={{ gap: `${gap ?? 0}px` }} {...rest}>
      {children}
    </div>
  );
}