import React from "react";
import styled, { keyframes } from "styled-components";
import colors from "../style/Colors";
import P2 from "../typography/P2";

const loadingAni = keyframes`
  50% {
    opacity: .35;
  }
`;

const OutlinedButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => (props.big ? "1.2em" : "1em")};
  text-align: center;
  border: 1px solid ${colors.light};
  border-radius: 0.25em;
  height: 46px;
  padding: 0 0.7em;
  width: ${props => (props.wide ? "100%" : "auto")};
  flex: 0 0 auto;

  background: transparent;

  img {
    display: inline;
    /* border: 1px solid red; */
    margin: 0;
  }

  p {
    margin: 0;
    line-height: 1.3;
    margin-left: 5px;
  }

  ${props => props.primary && `border-color: ${colors.accent_pink};`}

  cursor: pointer;
  outline: none;
  user-select: none;

  animation: ${props => props.loading && loadingAni} 1s 0.3s linear infinite;
  animation-timing-function: ease-in-out;

  &:active {
    opacity: 0.8;
  }

  ${props =>
    props.disabled &&
    `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const OutlinedButton = props => {
  const { onClick, icon, iconComponent } = props;

  return (
    <>
      <OutlinedButtonWrapper onClick={onClick} {...props}>
        {iconComponent && iconComponent()}
        {icon && <img src={icon} alt="" />}
        <P2 color={props.primary ? "accent_pink" : "grey"}>{props.children}</P2>
      </OutlinedButtonWrapper>
    </>
  );
};

export default OutlinedButton;
