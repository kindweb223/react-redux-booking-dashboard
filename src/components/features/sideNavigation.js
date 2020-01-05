import React from "react";
import P1 from "../typography/P1";
import styled from "styled-components";
import colors from "../style/colors";

const SideNavigation = props => {
  const { items, selectedItem, onClick } = props;

  const Container = styled.div`
    p {
      display: block;
      cursor: pointer;
      :first-child {
        margin-top: 0;
      }
      :last-child {
        margin-bottom: 0;
      }
    }
    .selected {
      color: ${colors.accent_pink};
      font-weight: 500;
    }
  `;

  return (
    <Container>
      {items.map(item => {
        return (
          <P1
            key={item}
            className={selectedItem === item ? "selected" : ""}
            onClick={() => {
              if (item === 'Suggestion')
                window.open('https://heyagenda.kampsite.co/', '_blank')
              else onClick(item)}
            }
          >
            {item}
          </P1>
        );
      })}
    </Container>
  );
};

export default SideNavigation;
