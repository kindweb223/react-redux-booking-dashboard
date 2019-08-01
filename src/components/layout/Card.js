import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  background: white;
  padding: 1.5em 1.8em 2em;
  border-radius: 0.5em;
  box-shadow: 0 15px 70px -20px rgba(0,0,0,.2), 0 3px 20px -5px rgba(0,0,0,.15);
  ${props =>
    props.center &&
    `
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: flex-start;
    // text-align: center;
  `}

  width: ${props => props.width};
  max-width: 100%;
`;

const Card = props => {
  const { center, width } = props;
  return (
    <CardWrapper center={center} width={width}>
      {props.children}
    </CardWrapper>
  );
};

export default Card;
