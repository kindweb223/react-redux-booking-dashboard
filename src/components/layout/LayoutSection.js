import React from "react";
import styled from "styled-components";
import colors from "../style/colors";
import LayoutBlock from "./LayoutBlock";

const LayoutSectionWrapper = styled.div`
  ${LayoutBlock};

  position: relative;

  overflow-x: hidden;
  overflow-y: scroll;

  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: ${props =>
      !props.bgColor ? "transparent" : colors[props.bgColor]};
    ${props =>
      props.skew &&
      `
      transform: skewY(${props.skew});
    `}
    ${props =>
      props.mask &&
      `
      mask: url(/masks/${props.mask}.svg);
    `}
  }

  > svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  display: flex;
  min-height: ${props => props.height};

  ${props =>
    props.center
      ? `
    align-items: center;
    justify-content: center;
    text-align: center;
    h1, h2, h3, h4, p, a {
      margin-right: auto;
      margin-left: auto;
      text-align: center;
    }
  `
      : ""}
  :last-child {
    flex: 1 1 auto;
  }

  > div {
    ${props =>
      props.small &&
      `
      width: 58em;
    `}
  }
  > div {
    ${props =>
      props.fullWidth &&
      `
      width: 100%;
    `}
  }
`;

const LayoutSection = props => {
  return (
    <>
      <LayoutSectionWrapper {...props}>
        <div style={{ width: props.width }}>{props.children}</div>
      </LayoutSectionWrapper>
    </>
  );
};

export default LayoutSection;
