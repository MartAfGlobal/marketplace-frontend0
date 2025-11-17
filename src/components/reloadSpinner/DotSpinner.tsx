// DotSpinner.tsx
import React from "react";
import "./dotspinner.css"; 

interface DotSpinnerProps {
  size?: number;       // dot size in px
  color?: string;      // CSS color (e.g. "#ff715b" or "white")
  gap?: number;        // space between dots
}

export default function DotSpinner({
  size = 8,
  color = "#ff715b",
  gap = 6,
}: DotSpinnerProps) {
  const dotStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: color,
    marginRight: gap,
  };

  return (
    <div className="dot-spinner" role="status" aria-label="Loading">
      <span className="dot" style={dotStyle}></span>
      <span className="dot" style={dotStyle}></span>
      <span className="dot" style={dotStyle}></span>
    </div>
  );
}
