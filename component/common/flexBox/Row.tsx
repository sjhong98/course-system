import React from "react";

type RowProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  gap?: number;
};

export default function Row({ children, className, gap, ...rest }: RowProps) {
  return (
    <div className={`flex flex-row ${className ?? ""}`} style={{ gap: `${gap ?? 0}px` }} {...rest}>
      {children}
    </div>
  );
}