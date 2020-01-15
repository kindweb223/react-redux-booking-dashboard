import styled from "styled-components";
import colors from "../style/Colors";

const P1 = styled.p`
  font-size: 1em;
  text-align: ${props => (props.center ? "center" : "left")};
  color: ${props => (props.color ? colors[props.color] : colors.grey)};
  margin: 0.3em 0 0.8em;
  font-weight: ${props => (props.strong ? 500 : 400)};
  line-height: 1.8;
  ${props =>
    props.ellipses
      ? `
    overflow: hidden;
    text-overflow: ellipsis;
  `
      : ``}
  @media (max-width: 640px) {
    font-size: 1.3em;
  }
  ${props =>
    props.serif &&
    `
    font-family: Lora, "Palatino Linotype", "Book Antiqua", Palatino, Georgia,
      serif;
    color: ${colors.ultra_dark};
    margin: 0.3em 0 0.8em;
    font-weight: 400;
    line-height: 1.8;
    font-size: 1.2em;
  `}
`;

export default P1;
