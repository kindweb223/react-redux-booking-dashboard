import React from "react";

const AddGlyph = props => {
  const { side = 24, fill = "#E92579" } = props;
  return (
    <svg
      width={side.toString()}
      height={side.toString()}
      viewBox={`0 0 ${side} ${side}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6L12 18"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12L18 12"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddGlyph;
