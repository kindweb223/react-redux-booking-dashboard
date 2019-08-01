import styled from "styled-components";
import colors from "../style/colors";

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.lightest};
  width: 100%;
  height: 100%;
  overflow: scroll;
  border-radius: 0.5em;
  box-shadow: 0px 13px 32px rgba(0, 0, 0, 0.22);
`;

const ModalTopSection = styled.div`
  background-color: white;
  position: sticky;
  top: 0;
  border-radius: 0.25em 0.25em 0 0;
  z-index: 1;
  border-bottom: 1px solid ${colors.light};
`;

const ModalTitleAndButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px 15px;
  padding-top: 20px;
`;

const ModalBottomSection = styled.div`
  width: 100%;
  flex: 1 1 auto;
  padding: 20px 20px 15px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > * {
  }
`;

export {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
};
