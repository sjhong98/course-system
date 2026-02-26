import { PADDING } from "@/lib/constants/constants";
import React from "react";

type PaddingHorizontalOverrideContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export default function PaddingHorizontalOverrideContainer({
  children,
  style,
  className,
  ...rest
}: PaddingHorizontalOverrideContainerProps) {
  
  const minusMarginValue = `-${PADDING}px`

  const marginStyle: React.CSSProperties = {
    marginRight: minusMarginValue,
    marginLeft: minusMarginValue,
  }

  return (
    <div
      className={`${className ?? ""}`}
      style={{ ...marginStyle, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

