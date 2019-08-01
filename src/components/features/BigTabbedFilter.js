import React from "react";
import styled from "styled-components";
import colors from "../style/colors";
import P1 from "../typography/P1";
import ColoredDot from "../buttons/ColoredDot";
import Button from "../buttons/Button";
import "react-dropdown/style.css";
import useMedia from "../../hooks/useMedia";
import PickerButton from "../buttons/PickerButton";

const Wrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
`;

const FilterItem = styled.div`
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 8px 50px; */
  border: 1px solid ${colors.light};
  /* ${props => (!props.first ? "border-left: none;" : null)}; */
  background: ${props => (props.selected ? "white" : colors.lighter)};
  cursor: pointer;
  border-radius: ${props => (props.first ? "4px 4px 4px 4px" : "0 4px 4px 0")};
  margin-left: ${props => (props.first ? 0 : "-10px")};
  ${props =>
    props.selected ? "box-shadow: 0px 1.5px 1px rgba(0, 0, 0, 0.05);" : ""}
`;

const BigTabbedFilter = props => {
  const { items, colors, selectedItem, onSelect, style } = props;

  let selectedOption = selectedItem;
  let allSelected = selectedOption === "All";
  if (allSelected) {
    selectedOption = null;
  }

  const compressed = useMedia(
    [`(max-width: ${210 * items.length}px)`],
    [true],
    false
  );

  return (
    <Wrapper style={style}>
      {compressed ? (
        <>
          <Button
            onClick={() => onSelect("All")}
            softSelected={allSelected}
            style={{ marginRight: ".5em" }}
          >
            All
          </Button>
          <PickerButton
            onOptionSelected={onSelect}
            selectedOption={selectedOption}
            options={items}
            noSelectionText="Select Status"
            colors={colors}
          />
        </>
      ) : (
        ["All"].concat(items).map((item, index) => {
          const selected = item === selectedItem;

          let colorComp = null;

          // skip "All"
          if (index > 0) {
            const itemIndex = items.indexOf(item);
            const color = colors[itemIndex];
            colorComp = <ColoredDot color={color} style={{ marginRight: 5 }} />;
          }

          return (
            <FilterItem
              key={item}
              first={index === 0}
              last={index === items.length}
              selected={selected}
              onClick={() => onSelect(item)}
            >
              {selected ? (
                <P1 color="dark" strong style={{ margin: 0 }}>
                  {colorComp} {item}
                </P1>
              ) : (
                <P1 color="grey" style={{ margin: 0 }}>
                  {colorComp} {item}
                </P1>
              )}
            </FilterItem>
          );
        })
      )}
    </Wrapper>
  );
};

export default BigTabbedFilter;
