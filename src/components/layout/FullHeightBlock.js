import React from "react";
import styled from "styled-components";

const FullHeightWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  /* align-items: flex-start; */
  > * {
    flex: 0 0 auto;
    /* &:last-child::before {
      content: "";
      position: relative;
      flex: 1 0 auto;
    } */
  }
`;

const FullHeightBlock = props => {
  return <FullHeightWrapper>{props.children}</FullHeightWrapper>;
};

export default FullHeightBlock;
