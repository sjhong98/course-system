import { PADDING } from "@/app/layout";
import React from "react";

type PaddingHorizontalOverrideContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  horizontal?: boolean;
  top?: boolean;
  bottom?: boolean;
};

export default function PaddingHorizontalOverrideContainer({
  children,
  style,
  className,
  ...rest
}: PaddingHorizontalOverrideContainerProps) {
  
  const minusMarginValue = `-${PADDING}px`

  const marginStyle: React.CSSProperties = {
    marginLeft: minusMarginValue,
    marginRight: minusMarginValue
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

