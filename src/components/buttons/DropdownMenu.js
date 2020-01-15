import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import colors from "../style/Colors";
import P2 from "../typography/P2";
import menuSvg from "../../images/Glyphs/menu.svg";
import SvgButton from "./SvgButton";

const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  input {
    width: 80%;
    font-size: 0.9em;
    border: none;

    :focus {
      outline-style: none;
      box-shadow: none;
      border-color: transparent;
    }
  }
`;

const DropdownContent = styled.div`
  display: ${props => (props.show ? "aboslute" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  right: 0;
  max-height: 250px;
  overflow-y: scroll;
  z-index: 1;
  background: #ffffff;
  color: ${colors.grey};
  box-shadow: 0px 1.5px 1px rgba(0, 0, 0, 0.05);
  padding: 5px 10px;
  border: 1px solid ${colors.light};
  border-radius: 0.25em;
  user-select: none;

  p {
    cursor: pointer;
    :hover {
      opacity: 0.7;
    }
    :last-child {
      margin-bottom: 0;
    }
  }
`;

const DropdownMenu = props => {
  const {
    items = [],
    colors = null,
    displayTransformer = null, // function that transforms an option for display
    onItemSelected
  } = props;

  const [opened, setOpened] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleDocumentClick = event => {
      if (ref.current) {
        if (!ReactDOM.findDOMNode(ref.current).contains(event.target)) {
          if (opened) {
            setOpened(false);
          }
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, false);

    return () => {
      document.removeEventListener("click", handleDocumentClick, false);
    };
  }, [ref, opened]);

  const makeItemComponent = (item, index) => {
    const color = colors && colors[index];

    return (
      <React.Fragment key={item}>
        <P2
          style={{
            marginRight: 10,
            color
          }}
          onClick={() => {
            setOpened(!opened);
            onItemSelected(item);
          }}
        >
          {displayTransformer ? displayTransformer(item) : item}
        </P2>
      </React.Fragment>
    );
  };

  return (
    <Dropdown ref={ref}>
      <SvgButton
        size={24}
        svg={menuSvg}
        onClick={() => {
          setOpened(!opened);
        }}
      />
      <DropdownContent show={opened}>
        {items && items.map(makeItemComponent)}
      </DropdownContent>
    </Dropdown>
  );
};

export default DropdownMenu;
