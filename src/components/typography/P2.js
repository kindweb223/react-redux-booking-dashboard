import styled from "styled-components";
import colors from "../style/Colors";

const P2 = styled.p`
  font-size: 0.9em;
  text-align: ${props => (props.center ? "center" : "left")};
  color: ${props => (props.color ? colors[props.color] : colors.dark)};
  margin: 0.1em 0 0.6em;
  font-weight: ${props => (props.strong ? 500 : 400)};
  line-height: 1.7;
`;

export default P2;
