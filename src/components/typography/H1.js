import styled from "styled-components";
import colors from "../style/colors";

const H1 = styled.h1`
  font-size: 3.4em;
  text-align: ${props => (props.center ? "center" : "left")};
  color: ${props => (props.color ? colors[props.color] : colors.white)};
  margin: 0.2em 0 0.3em;
  font-weight: 700;
  line-height: 1.3;
  text-decoration: none;
  a {
    text-decoration: none;
  }
  @media (max-width: 640px) {
    font-size: 2.6em;
  }
`;

export default H1;
