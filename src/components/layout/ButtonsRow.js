import styled from "styled-components";

const ButtonsRow = styled.div`
  > div {
    margin: 0 0.3em;
    :first-child {
      margin-left: 0;
    }
    :last-child {
      margin-right: 0;
    }
  }
`;

export default ButtonsRow;
