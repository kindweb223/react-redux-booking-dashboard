import React from "react";
import { css } from "emotion";
import colors from "../style/Colors";

const tgWidth = 2.5;
const tgHeight = 1.6;
const tgPadding = 0.2;
const tgNobHeight = tgHeight - tgPadding * 2;
const tgNobMoved = tgWidth - tgNobHeight - tgPadding;

const Toggle = props => {
  const { onChange, enabled = true, style } = props;

  return (
    <div
      style={style}
      onClick={onChange}
      className={css`
        display: inline-block;
        padding: 0.2em;
        background: ${enabled ? colors.accent_pink : colors.grey};
        width: ${tgWidth}em;
        height: ${tgHeight}em;
        border-radius: ${tgHeight}em;
        position: relative;
        transition: background 0.1s;
        cursor: pointer;
      `}
    >
      <div // white thumb indicating selection state
        className={css`
          position: absolute;
          left: ${enabled ? tgNobMoved + "em" : tgPadding + "em"};
          top: ${tgPadding}em;
          width: ${tgNobHeight}em;
          height: ${tgNobHeight}em;
          border-radius: 50%;
          transition: left 0.1s;
          background: ${enabled ? "white" : "rgba(255,255,255,.75)"};
        `}
      />
    </div>
  );
};

export default Toggle;
