import React from "react";
import P1 from "../typography/P1";
import styled from "styled-components";
import colors from "../style/colors";

const TabBar = props => {
  const { items, selectedItem, onOptionSelected, itemsSideMargin = 0 } = props;

  const Container = styled.div`
    border-bottom: 1px solid ${colors.light};
    p {
      display: inline-block;
      margin: 0 1em 0 0;
      cursor: pointer;
      padding: 0 0 0.5em;
      :first-child {
        margin-left: ${itemsSideMargin}px;
      }
      :last-child {
        margin-right: ${itemsSideMargin}px;
      }
    }
    .selected {
      color: ${colors.accent_pink};
      font-weight: 500;
      border-bottom: 2px solid ${colors.accent_pink};
    }
  `;

  return (
    <Container>
      {items.map(item => {
        return (
          <P1
            key={item}
            className={selectedItem === item ? "selected" : ""}
            onClick={() => onOptionSelected(item)}
          >
            {item}
          </P1>
        );
      })}
    </Container>
  );
};

export default TabBar;
