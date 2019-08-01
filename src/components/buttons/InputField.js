import React from "react";
import colors from "../style/colors";
import { css } from "emotion";

const InputField = props => {
  return (
    <input
      {...props}
      className={css`
        font-size: 0.95em;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
        border: 1px solid #e6e8e9;
        border-radius: 0.25em;
        color: ${colors.dark};
        height: 34px;
        padding: 0 0.6em;
        flex: 0 0 auto;
      `}
    />
  );
};

export default InputField;
