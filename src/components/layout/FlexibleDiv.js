import React from "react";
import styled from "styled-components";

const FlexibleDivWrapper = styled.div`
  flex: 1 1 auto;
  margin-bottom: ${props => (props.margin ? props.margin : "0")};
`;

const FlexibleDiv = props => {
  return <FlexibleDivWrapper {...props} />;
};

export default FlexibleDiv;
