import React from "react";
import styled from "styled-components";
import colors from "../style/Colors";

// Styled like an H5

const InputLabelWrapper = styled.label`
  font-size: 0.82em;
  font-weight: 500;
  line-height: 1.55;
  color: ${colors.grey};
  margin-bottom: 0.3em;
`;

const InputLabel = props => {
  return <InputLabelWrapper {...props} />;
};

export default InputLabel;
