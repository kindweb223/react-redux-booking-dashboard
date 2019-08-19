import React from 'react';
import styled from "styled-components";

const Container = styled.div`
  display: ${props => (props.loading === "true" ? "flex" : "none" )};
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  flex-direction: row;
  justify-content: center;
  pointer-events: none;
  z-index: 999;

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
    margin-top: 200px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 51px;
    height: 51px;
    margin: 6px;
    border: 6px solid #E92579;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #E92579 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

`;

const SpinnerContainer = props => {
  return (
    <Container loading={props.loading}>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </Container>
  )
}

export default SpinnerContainer;