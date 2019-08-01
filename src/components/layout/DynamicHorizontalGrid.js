import React from "react";
import styled from "styled-components";

const DynamicGridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${props => (props.baseWidth ? props.baseWidth : "20em")}, 1fr)
  );
  grid-gap: ${props => (props.gap ? props.gap : "1em")};
  margin: 0 auto;
  max-width: ${props => (props.maxWidth ? props.maxWidth : "auto")};
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DynamicHorizontalGrid = props => (
  <DynamicGridWrapper {...props}>{props.children}</DynamicGridWrapper>
);

export default DynamicHorizontalGrid;
