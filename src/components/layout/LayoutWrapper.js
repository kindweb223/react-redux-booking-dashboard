import React from "react";
import styled from "styled-components";

const LayoutWrapperWrapper = styled.div`
  min-height: 100vh;
  height: 100vh;
  max-width: 100vw;
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
`;

const LayoutWrapper = props => {
  return (
    <LayoutWrapperWrapper {...props}>{props.children}</LayoutWrapperWrapper>
  );
};

export default LayoutWrapper;
