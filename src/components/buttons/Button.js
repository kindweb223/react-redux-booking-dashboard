import React from "react";
import styled, { keyframes } from "styled-components";
import colors from "../style/colors.js";
import P2 from "../typography/P2.js";

const loadingAni = keyframes`
  50% {
    opacity: .35;
  }
`;

const ButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => (props.big ? "1.2em" : "1em")};
  text-align: center;
  border: 1px solid ${colors.light};
  border-radius: 0.25em;
  height: 34px;
  padding: 0 0.7em;
  width: ${props => (props.wide ? "100%" : "auto")};
  flex: 0 0 auto;

  background: #ffffff;
  color: ${colors.grey};
  box-shadow: 0px 1.5px 1px rgba(0, 0, 0, 0.05);

  p {
    margin: 0;
    line-height: 1.5;
  }

  ${props =>
    (props.selected || props.primary) && `border-color: ${colors.accent_pink};`}

  ${props =>
    props.softSelected &&
    `
    p {color: ${colors.darker}}
  `}

  ${props =>
    props.primary &&
    `
    background: ${colors.accent_pink};
    p {color: white;}
    box-shadow: 0px 2px 2px rgba(202, 97, 142, 0.3);
  `}

  ${props =>
    props.oulined &&
    `
    background: transparent;
    border: 1px solid ${colors.light};
    box-shadow: none;
  `}


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

const Button = props => {
  const { onClick, icon, iconComponent } = props;

  return (
    <>
      <ButtonWrapper onClick={onClick} {...props}>
        {iconComponent && iconComponent()} {icon && <img src={icon} alt="" />}{" "}
        <P2 color="grey">{props.children}</P2>
      </ButtonWrapper>
    </>
  );
};

export default Button;
