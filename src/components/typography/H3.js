import styled from "styled-components";
import colors from "../style/Colors";

const H3 = styled.h3`
  font-size: 1.3em;
  text-align: ${props => (props.center ? "center" : "left")};
  color: ${props => (props.color ? colors[props.color] : colors.dark)};
  margin: 0.1em 0 0.6em;
  font-weight: 500;
  line-height: 1.55;
  @media (max-width: 640px) {
    font-size: 1.6em;
  }
`;

export default H3;
