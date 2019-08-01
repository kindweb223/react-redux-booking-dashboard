import React from "react";
import styled from "styled-components";
import colors from "../style/colors";

const StyledTextAreaWrapper = styled.textarea`
  font-size: 0.95em;
  display: inline-flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  border: 1px solid #e6e8e9;
  border-radius: 0.25em;
  color: ${colors.dark};
  min-height: 34px;
  padding: 0.5em 0.6em;
  flex: 0 0 auto;
  resize: none;
`;

const TextArea = props => {
  return <StyledTextAreaWrapper {...props} />;
};

export default TextArea;
