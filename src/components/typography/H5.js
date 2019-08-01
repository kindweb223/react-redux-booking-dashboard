import styled from "styled-components";
import colors from "../style/colors";

const H5 = styled.h5`
  font-size: 0.82em;
  font-weight: 500;
  line-height: 1.55;
  margin: 0.3em 0 0.6em;
  text-align: ${props => (props.center ? "center" : "left")};
  color: ${props => (props.color ? colors[props.color] : colors.dark)};
`;

export default H5;
