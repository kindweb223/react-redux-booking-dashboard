import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styled from "styled-components";

import { AppReducerContext, getStatuColor } from "../../contexts/AppReducerContext";
import colors from "../style/Colors";
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
  marginBottom: 0;
  marginTop: 0;
  height: 60px;
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
  const [items, setItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [counts] = useState([]);
  
  // const { selectedItem, onSelect } = props;
  
  const { state, dispatch } = useContext(AppReducerContext);

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

  useEffect(() => {  
    setItems(state.bookings.bookingStatus.map(item => item.name));
    setColors(state.bookings.bookingStatus.map(item => getStatuColor(item.name)));
    
    state.bookings.bookingStatus.map(item => {
      const filtered_bookings = state.bookings.bookings.filter(booking => booking.statusId === item.id);
      counts.push(filtered_bookings.length);
    });
  },[state.bookings.bookings, state.bookings.bookingStatus]);

  return (
    <Wrapper>
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
                  <Link to={{
                      pathname: "/bookings", 
                      state: {
                        filterName: "item"
                      }
                    }}>
                    {colorComp} {item} ({index === 0 ? state.bookings.bookings.length : counts[index-1]})
                  </Link>
                </P1>
              ) : (
                <P1 color="grey" style={{ margin: 0 }}>
                  <Link to="/bookings">{colorComp} {item} ({index === 0 ? state.bookings.bookings.length : counts[index-1]})</Link>
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
