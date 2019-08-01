import React from "react";
import { css } from "emotion";

const SvgButton = props => {
  const { width, height, size, svg, onClick, style } = props;
  const actualWidth = width || size;
  const actualHeight = height || size;

  return (
    <div
      onClick={onClick}
      style={style}
      {...props}
      className={css`
        width: ${actualWidth}px;
        height: ${actualHeight}px;
        background: url(${svg});
        background-size: 100% 100%;
        cursor: pointer;

        :active {
          opacity: 0.5;
        }
      `}
    />
  );
};

export default SvgButton;
