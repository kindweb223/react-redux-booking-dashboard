import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import colors from "../style/colors.js";
import P2 from "../typography/P2.js";
import arrowDown from "../../images/ui/arrowDown.svg";
import ColoredDot from "./ColoredDot.js";

const loadingAni = keyframes`
  50% {
    opacity: .35;
  }
`;

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => (props.big ? "1.2em" : "1em")};
  border: 1px solid ${colors.light};
  border-radius: 0.25em;
  height: 34px;
  padding: 0 0.7em;
  width: ${props => (props.wide ? "100%" : "auto")};
  background: #ffffff;
  color: ${colors.grey};
  box-shadow: 0px 1.5px 1px rgba(0, 0, 0, 0.05);

  p {
    margin: 0;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  ${props =>
    props.selected &&
    `
    border-color: ${colors.accent_pink};
  `}

  ${props =>
    props.primary &&
    `
    background: ${colors.accent_pink};
    p {color: white;}
    box-shadow: 0px 2px 2px rgba(202, 97, 142, 0.3);
  `}

  ${props =>
    props.oulined &&
    `
    background: transparent;
    border: 1px solid ${colors.light};
    box-shadow: none;
  `}


  cursor: pointer;
  outline: none;
  user-select: none;

  animation: ${props => props.loading && loadingAni} 1s 0.3s linear infinite;
  animation-timing-function: ease-in-out;

  &:active {
    opacity: 0.8;
  }

  ${props =>
    props.disabled &&
    `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

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
  min-width: 160px;
  width: 100%;
  max-height: 250px;
  overflow-y: scroll;
  z-index: 1;
  background: #ffffff;
  color: ${colors.grey};
  box-shadow: 0px 1.5px 1px rgba(0, 0, 0, 0.05);
  padding: 5px 10px;
  border: 1px solid ${colors.light};
  border-radius: 0.25em;

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

const PickerButton = props => {
  const {
    options = [],
    colors = null, // array, same order as `options`
    selectedOption,
    displayTransformer = null, // function that transforms an option for display
    onOptionSelected,
    noSelectionText = "None",
    searchEnabled = false,
    offersToCreateIfNotFound = false
  } = props;

  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredOptions = (() => {
    if (searchEnabled) {
      return (
        options &&
        options.filter(
          opt => opt.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
        )
      );
    } else {
      return options;
    }
  })();

  function selectFirstFilteredOption() {
    if (filteredOptions.length >= 0) {
      onOptionSelected(filteredOptions[0]);
      setSearchQuery("");
      setOpened(false);
    }
  }

  const transformedSelectedOption =
    displayTransformer && selectedOption
      ? displayTransformer(selectedOption)
      : selectedOption;

  const searchOptionComponent = () => (
    <input
      placeholder="Search"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      onKeyPress={e => e.key === "Enter" && selectFirstFilteredOption()}
      ref={ref => ref && ref.focus()}
    />
  );

  const selectedOptionComponent = () => {
    if (opened && searchEnabled) {
      return searchOptionComponent();
    }

    if (!selectedOption) {
      return <P2 color="grey">{noSelectionText}</P2>;
    }

    if (colors) {
      const optionIndex = options.indexOf(selectedOption);
      const color = colors[optionIndex];

      return (
        <>
          <ColoredDot color={color} />
          <P2 style={{ marginLeft: 5 }}>{transformedSelectedOption}</P2>
        </>
      );
    } else {
      return <P2>{transformedSelectedOption}</P2>;
    }
  };

  const makeOptionComponent = option => {
    const optionIndex = options.indexOf(option);
    const color = colors && colors[optionIndex];

    return (
      <React.Fragment key={option}>
        <P2
          color={option === selectedOption ? "dark" : "grey"}
          style={{
            marginRight: 10
          }}
          onClick={() => {
            setOpened(!opened);
            if (opened) {
              setSearchQuery("");
            }

            onOptionSelected(option);
          }}
        >
          {color && <ColoredDot color={color} style={{ marginRight: 8 }} />}
          {displayTransformer ? displayTransformer(option) : option}
        </P2>
      </React.Fragment>
    );
  };

  return (
    <Dropdown ref={ref}>
      <Wrapper
        onClick={() => {
          if (options && options.length) {
            setOpened(!opened);
            if (opened) {
              setSearchQuery("");
            }
          }
        }}
        style={props.style}
      >
        {selectedOptionComponent()}
        <img
          src={arrowDown}
          alt="Show options"
          style={{ transform: opened ? "scaleY(-1)" : "", marginLeft: 5 }}
        />
      </Wrapper>
      <DropdownContent show={opened}>
        {(() => {
          if (searchEnabled) {
            if (filteredOptions) {
              if (filteredOptions.length) {
                return filteredOptions.map(makeOptionComponent);
              } else if (offersToCreateIfNotFound) {
                return (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onOptionSelected(searchQuery);
                      setSearchQuery("");
                      setOpened(false);
                    }}
                  >
                    Click to create <strong>"{searchQuery}"</strong>
                  </span>
                );
              } else {
                return "None found";
              }
            }
          } else {
            return options && options.map(makeOptionComponent);
          }
        })()}
      </DropdownContent>
    </Dropdown>
  );
};

export default PickerButton;
