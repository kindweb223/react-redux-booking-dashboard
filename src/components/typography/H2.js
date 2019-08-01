import styled from "styled-components";
import colors from "../style/colors";

const H2 = styled.h2`
  font-size: 2em;
  text-align: ${props => (props.center ? "center" : "left")};
  color: ${props => (props.color ? colors[props.color] : colors.ultra_dark)};
  margin: 0.1em 0 0.25em;
  font-weight: 500;
  line-height: 1.35;
  text-decoration: none;
  a {
    text-decoration: none;
  }
  @media (max-width: 640px) {
    font-size: 2.4em;
  }
`;

export default H2;
