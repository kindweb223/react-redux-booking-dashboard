import styled from "styled-components";

const ColoredDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  display: inline-block;
  background-color: ${props => props.color};
`;

export default ColoredDot;
