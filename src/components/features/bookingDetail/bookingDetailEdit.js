import React, { useReducer, useEffect, useContext } from "react";
import styled from "styled-components";
import H3 from "../../typography/H3";
import colors from "../../style/colors";
import Button from "../../buttons/Button";
import Grid from "../../layout/Grid";
import {
  TableSectionHeader,
  Table,
  TableEditableValue,
  TablePicker
} from "../../tables/tables";
import AddGlyph from "../../../images/Glyphs/AddGlyph";
import RemoveSvg from "../../../images/ui/remove.svg";
import OutlinedButton from "../../buttons/OutlinedButton";
import SvgButton from "../../buttons/SvgButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/date-picker.css";
import { updatedDate, addDays } from "../../../utils/dates";
import owners from "../../../models/owners";
import {
  ModalContainer,
  ModalTitleAndButtons,
  ModalBottomSection,
  ModalTopSection
} from "../../modals/containers";
import Spacer from "../../layout/Spacer";
import { AppReducerContext } from "../../../contexts/AppReducerContext";

const SvgButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookingForm = props => {
  const { booking, dispatch } = props;
  const { state } = useContext(AppReducerContext);
  const venues = state.settings.venues;
  const selectedVenue =
    booking.venue && venues.find(v => v.id === booking.venue);

  return (
    <>
      <TableEditableValue
        label="Event Name"
        value={booking.title}
        onChange={title => dispatch({ type: "set_title", value: title })}
        style={{ width: "100%" }}
      />
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 10 }}>
        <TablePicker
          label="Venue"
          selectedOption={booking.venue}
          options={venues.map(venue => venue.id)}
          displayTransformer={opt => venues.find(v => v.id === opt).name}
          onOptionSelected={venueID =>
            dispatch({
              type: "select_venue",
              venue: venueID
            })
          }
          style={{ width: "100%" }}
        />
        <TablePicker
          label="Space"
          selectedOption={booking.space}
          options={selectedVenue && selectedVenue.spaces.map(s => s.id)}
          displayTransformer={spaceId =>
            selectedVenue.spaces.find(s => s.id === spaceId).name
          }
          onOptionSelected={spaceID => {
            dispatch({ type: "select_space", space: spaceID });
          }}
          style={{ width: "100%" }}
        />
        <TablePicker
          label="Customer"
          options={state.customers.map(customer => customer.id)}
          selectedOption={booking.customer}
          displayTransformer={customerId =>
            state.customers.find(c => c.id === customerId).name
          }
          searchEnabled
          onOptionSelected={customerId => {
            dispatch({
              type: "select_customer",
              customer: customerId
            });
          }}
          style={{ width: "100%" }}
        />
        <TablePicker
          label="Owner"
          options={owners}
          selectedOption={booking.owner}
          onOptionSelected={owner =>
            dispatch({
              type: "select_owner",
              value: owner
            })
          }
          style={{ width: "100%" }}
        />
      </Grid>

      <TableSectionHeader title={"Booking Slots"} />

      {booking.slots.length > 0 && (
        <Table
          columns="1fr 1fr 1fr auto"
          columnTitles={["Date", "Start", "End", ""]}
        >
          {booking.slots
            .map((slot, index) => {
              switch (slot.kind) {
                case "multi-day":
                  const startDate = slot.dateRange[0];
                  const endDate = slot.dateRange[slot.dateRange.length - 1];
                  return (
                    <React.Fragment key={index}>
                      <div style={{ display: "flex" }}>
                        <DatePicker
                          selected={startDate}
                          startDate={startDate}
                          endDate={endDate}
                          selectsEnd
                          onChange={date =>
                            dispatch({
                              type: "update_multiday_slot_start",
                              index: index,
                              value: date
                            })
                          }
                        />
                        <DatePicker
                          selected={endDate}
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          selectsEnd
                          onChange={date =>
                            dispatch({
                              type: "update_multiday_slot_end",
                              index: index,
                              value: date
                            })
                          }
                        />
                      </div>
                      <DatePicker
                        selected={updatedDate(
                          new Date(),
                          slot.startHour,
                          slot.startMinute
                        )}
                        onChange={date =>
                          dispatch({
                            type: "update_slot_start_time",
                            index: index,
                            key: "date",
                            date: date
                          })
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                      />
                      <DatePicker
                        selected={updatedDate(
                          new Date(),
                          slot.endHour,
                          slot.endMinute
                        )}
                        onChange={date =>
                          dispatch({
                            type: "update_slot_end_time",
                            index: index,
                            key: "date",
                            date: date
                          })
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                      />
                      <SvgButtonWrapper>
                        <SvgButton
                          svg={RemoveSvg}
                          width={20}
                          height={20}
                          onClick={() =>
                            dispatch({ type: "remove_slot", index: index })
                          }
                        />
                      </SvgButtonWrapper>
                    </React.Fragment>
                  );
                case "single-day":
                  return (
                    <React.Fragment key={index}>
                      <DatePicker
                        selected={slot.date}
                        onChange={date =>
                          dispatch({
                            type: "update_slot",
                            index: index,
                            key: "date",
                            value: date
                          })
                        }
                      />
                      <DatePicker
                        selected={updatedDate(
                          new Date(),
                          slot.startHour,
                          slot.startMinute
                        )}
                        onChange={date =>
                          dispatch({
                            type: "update_slot_start_time",
                            index: index,
                            key: "date",
                            date: date
                          })
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                      />
                      <DatePicker
                        selected={updatedDate(
                          new Date(),
                          slot.endHour,
                          slot.endMinute
                        )}
                        onChange={date =>
                          dispatch({
                            type: "update_slot_end_time",
                            index: index,
                            key: "date",
                            date: date
                          })
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                      />
                      <SvgButtonWrapper>
                        <SvgButton
                          svg={RemoveSvg}
                          width={20}
                          height={20}
                          onClick={() =>
                            dispatch({ type: "remove_slot", index: index })
                          }
                        />
                      </SvgButtonWrapper>
                    </React.Fragment>
                  );
                default:
                  throw new Error();
              }
            })
            .flat()}
        </Table>
      )}
      <div style={{ display: "flex" }}>
        <OutlinedButton
          style={{ marginTop: 10 }}
          onClick={() => dispatch({ type: "append_slot" })}
          iconComponent={() => <AddGlyph fill={colors.grey} />}
        >
          Add Single Date
        </OutlinedButton>
        <OutlinedButton
          style={{ marginTop: 10, marginLeft: 10 }}
          onClick={() => dispatch({ type: "append_slot_multi" })}
          iconComponent={() => <AddGlyph fill={colors.grey} />}
        >
          Add Date Range
        </OutlinedButton>
      </div>
    </>
  );
};

const BookingDetailEdit = props => {
  const { booking: bookingToEdit, onEndEditing, startDate, endDate } = props;

  const [state, dispatch] = useReducer(singleBookingReducer, bookingToEdit);

  useEffect(() => {
    if (startDate && endDate) {
      // opened from dragging in the calendar to create a new booking
      // with the time range selected in the calendar

      dispatch({ type: "remove_slot", index: 0 });

      dispatch({
        type: "append_slot",
        date: startDate,
        startDate: startDate,
        endDate: endDate
      });
    }
  }, [startDate, endDate, dispatch]);

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3>{state.title || "New Booking"}</H3>
          <div>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(null)}
            >
              Cancel
            </Button>
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(state)}
            >
              Save
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        <BookingForm booking={state} dispatch={dispatch} />
        <Spacer />
      </ModalBottomSection>
    </ModalContainer>
  );
};

function singleBookingReducer(state, action) {
  switch (action.type) {
    case "set_title":
      return { ...state, title: action.value };

    case "update_slot": {
      const slot = state.slots[action.index];
      slot[action.key] = action.value;
      return {
        ...state,
        slots: [
          ...state.slots.slice(0, action.index),
          slot,
          ...state.slots.slice(action.index + 1)
        ]
      };
    }
    case "update_multiday_slot_start": {
      const slot = state.slots[action.index];
      slot.dateRange[0] = action.value;
      return {
        ...state,
        slots: [
          ...state.slots.slice(0, action.index),
          slot,
          ...state.slots.slice(action.index + 1)
        ]
      };
    }
    case "update_multiday_slot_end": {
      const slot = state.slots[action.index];
      slot.dateRange[1] = action.value;
      return {
        ...state,
        slots: [
          ...state.slots.slice(0, action.index),
          slot,
          ...state.slots.slice(action.index + 1)
        ]
      };
    }
    case "update_slot_start_time": {
      const slot = state.slots[action.index];
      slot.startHour = action.date.getHours();
      slot.startMinute = action.date.getMinutes();
      return {
        ...state,
        slots: [
          ...state.slots.slice(0, action.index),
          slot,
          ...state.slots.slice(action.index + 1)
        ]
      };
    }
    case "update_slot_end_time": {
      const slot = state.slots[action.index];
      slot.endHour = action.date.getHours();
      slot.endMinute = action.date.getMinutes();
      return {
        ...state,
        slots: [
          ...state.slots.slice(0, action.index),
          slot,
          ...state.slots.slice(action.index + 1)
        ]
      };
    }

    case "append_slot":
      return {
        ...state,
        slots: [
          ...state.slots,
          {
            kind: "single-day",
            date: action.date || new Date(),
            startHour: (action.startDate && action.startDate.getHours()) || 9,
            startMinute:
              (action.startDate && action.startDate.getMinutes()) || 0,
            endHour: (action.endDate && action.endDate.getHours()) || 18,
            endMinute: (action.endDate && action.endDate.getMinutes()) || 0
          }
        ]
      };

    case "append_slot_multi":
      return {
        ...state,
        slots: [
          ...state.slots,
          {
            kind: "multi-day",
            dateRange: [new Date(), addDays(new Date(), 1)],
            startHour: 9,
            startMinute: 0,
            endHour: 18,
            endMinute: 0
          }
        ]
      };

    case "remove_slot":
      return {
        ...state,
        slots: [
          ...state.slots.slice(0, action.index),
          ...state.slots.slice(action.index + 1)
        ]
      };

    case "update_discount": {
      return {
        ...state,
        discount: Math.min(Math.max(action.value, 0), 99)
      };
    }
    case "select_venue": {
      return {
        ...state,
        venue: action.venue,
        space: null
      };
    }
    case "select_space": {
      return {
        ...state,
        space: action.space
      };
    }
    case "select_customer": {
      return {
        ...state,
        customer: action.customer
      };
    }
    case "select_owner": {
      return {
        ...state,
        owner: action.value
      };
    }

    default:
      throw new Error();
  }
}

export default BookingDetailEdit;
