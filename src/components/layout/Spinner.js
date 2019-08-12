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
  
  div,
  div:before,
  div:after {
    background: #ffffff;
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }
  div {
    color: #ffffff;
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
    margin-top: 200px;
  }
  div:before,
  div:after {
    position: absolute;
    top: 0;
    content: '';
  }
  div:before {
    left: -1.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  div:after {
    left: 1.5em;
  }
  @-webkit-keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
`;

const SpinnerContainer = props => {
  return (
    <Container loading={props.loading}>
      <div></div>
    </Container>
  )
}

export default SpinnerContainer;