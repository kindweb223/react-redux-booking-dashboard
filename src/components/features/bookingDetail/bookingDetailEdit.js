import React, { useReducer, useEffect, useContext } from "react";
import axios from 'axios';
import styled from "styled-components";
import { css } from "emotion";
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
import {
  ModalContainer,
  ModalTitleAndButtons,
  ModalBottomSection,
  ModalTopSection
} from "../../modals/containers";
import Spacer from "../../layout/Spacer";
import { AppReducerContext } from "../../../contexts/AppReducerContext";
import SpinnerContainer from "../../layout/Spinner";

import {
  REQUSET_GET_BOOKING_CUSTOMER,
  GET_BOOKING_CUSTOMER_SUCCESS,
  GET_BOOKING_CUSTOMER_ERROR,
  REQUSET_GET_BOOKING_VENUES,
  GET_BOOKING_VENUES_SUCCESS,
  GET_BOOKING_VENUES_ERROR,
  REQUEST_GET_BOOKING_SPACES,
  GET_BOOKING_SPACES_SUCCESS,
  GET_BOOKING_SPACES_ERROR,
  UPDATE_ADD_BOOKINGFORM_VALIDATE,
} from "../../../reducers/actionType";

const SvgButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookingForm = props => {
  const { booking, dispatch } = props;
  const { state } = useContext(AppReducerContext);

  useEffect(() => {
    if(booking.venueId === null)
      return;
    const getSpaces = async () => {
      try {        
        dispatch({ type: REQUEST_GET_BOOKING_SPACES });

        const res = await axios.get(`/spaces/venue/${booking.venueId}`);

        dispatch({
          type: GET_BOOKING_SPACES_SUCCESS,
          payload: res.data.spaces
        })

      } catch (err) {
        dispatch({ type: GET_BOOKING_SPACES_ERROR });
      }
    }
    getSpaces();
  }, [booking.venueId])

  return (
    <>
      <TableEditableValue
        label="Event Name"
        value={booking.eventName}
        onChange={title => dispatch({ type: "set_title", value: title })}
        style={{ width: "100%" }}
        className={(!booking.validateForm.eventName? "error" : "")}
      />
      {
        !booking.validateForm.eventName && 
        <p 
          className={
            css`
              color: #E92579;            
              margin: 0.2em 0 0 0;
              padding: 0 0.6em;
              font-size: 0.8em;
            `
          }
        >
          Booking Event Name is required.
        </p>
      }   
      <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 10 }}>
        <div>          
          <TablePicker
            label="Venue"
            selectedOption={booking.venueId}
            options={booking.venues.map(venue => venue.id)}
            searchEnabled
            optionsForSearch={
              booking.venues.map(item => {
                return {value: item.id, label: item.name}
              })
            }            
            displayTransformer={opt => {
              const filteredVenue = booking.venues.filter(v => v.id === opt);
              if (filteredVenue.length > 0)
                return filteredVenue[0].name;
              return null;
            }}
            onOptionSelected={venueID =>
              dispatch({
                type: "select_venue",
                venue: venueID
              })
            }
            style={{ width: "100%" }}
            isValidate={booking.validateForm.venueId}
          />
          {
            !booking.validateForm.venueId && 
            <p 
              className={
                css`
                  color: #E92579;            
                  margin: 0.2em 0 0 0;
                  padding: 0 0.6em;
                  font-size: 0.8em;
                `
              }
            >
              Venue is required.
            </p>
          }
        </div>        
        <div>
          <TablePicker
            label="Space"
            selectedOption={booking.spaceId}
            options={booking.venueId && booking.spaces.map(s => s.id)}
            displayTransformer={spaceId => {
              const filteredSpace = booking.spaces.filter(s => s.id === spaceId);
              if (filteredSpace.length > 0)
                return filteredSpace[0].name;
              else return null;
            }}
            onOptionSelected={spaceID => {
              dispatch({ type: "select_space", space: spaceID });
            }}
            searchEnabled
            optionsForSearch={
              booking.spaces.map(item => {
                return {value: item.id, label: item.name}
              })
            }
            style={{ width: "100%" }}
            isValidate={booking.validateForm.spaceId}
          />
          {
            !booking.validateForm.spaceId && 
            <p 
              className={
                css`
                  color: #E92579;            
                  margin: 0.2em 0 0 0;
                  padding: 0 0.6em;
                  font-size: 0.8em;
                `
              }
            >
              Space is required.
            </p>
          }
        </div>

        <div>
          <TablePicker
            label="Customer"
            options={booking.customers.map(customer => customer.id)}
            optionsForSearch={
              booking.customers.map(item => {
                return { value: item.id, label: item.name }
              })            
            }
            selectedOption={booking.customerId}
            displayTransformer={customerId => {
              const filteredCustomer = booking.customers.filter(c => c.id === customerId);
              if (filteredCustomer.length > 0)
                return filteredCustomer[0].name;
              else return "";
            }}
            searchEnabled
            onOptionSelected={customerId => {
              dispatch({
                type: "select_customer",
                customer: customerId
              });
            }}
            style={{ width: "100%" }}
            isValidate={booking.validateForm.customerId}
          />
          {
            !booking.validateForm.customerId && 
            <p 
              className={
                css`
                  color: #E92579;            
                  margin: 0.2em 0 0 0;
                  padding: 0 0.6em;
                  font-size: 0.8em;
                `
              }
            >
              Customer is required.
            </p>
          }
        </div>

        <div>
          <TablePicker
            label="Owner"
            options={booking.owners.map(owner => owner.id)}
            selectedOption={booking.ownerId}
            onOptionSelected={owner =>
              dispatch({
                type: "select_owner",
                value: owner
              })
            }
            style={{ width: "100%" }}
            isValidate={booking.validateForm.ownerId}
            displayTransformer={ownerId => {
              const filteredOwner = booking.owners.filter(c => c.id === ownerId);
              if (filteredOwner.length > 0)
                return filteredOwner[0].firstName + " " + filteredOwner[0].lastName;
              else return "";
            }}
          />
          {
            !booking.validateForm.ownerId && 
            <p 
              className={
                css`
                  color: #E92579;            
                  margin: 0.2em 0 0 0;
                  padding: 0 0.6em;
                  font-size: 0.8em;
                `
              }
            >
              Owner is required.
            </p>
          }
        </div>
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
                  const startDate = new Date(slot.dateRange[0]);
                  const endDate = new Date(slot.dateRange[slot.dateRange.length - 1]);
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
                        selected={new Date(slot.date)}
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

  const [state, dispatch] = useReducer(
    singleBookingReducer, 
    {
      ...bookingToEdit,
      loadingBookingDetilas: false,
      customers: [],
      venues: [],
      spaces: [],
      owners: [{
        "id": 1,
        "firstName": "Test",
        "lastName": "123",
      }],
      validateForm: {
        eventName: true,
        venueId: true,
        spaceId: true,
        customerId: true,
        ownerId: true,        
      }
    }
  );

  useEffect(() => {    
    const getCustomers = async () => {
      try {
        dispatch({ type: REQUSET_GET_BOOKING_CUSTOMER });

        const res = await axios.get('/customers');
        
        dispatch({
          type: GET_BOOKING_CUSTOMER_SUCCESS,
          payload: res.data.customers
        })

      } catch (err) {
        dispatch({ type: GET_BOOKING_CUSTOMER_ERROR });
      }
    }
    getCustomers();
    
    const getVenues = async () => {
      try {
        dispatch({ type: REQUSET_GET_BOOKING_VENUES });

        const res = await axios.get('/venues');
        const venues = res.data.venues;
        venues.map(item => {
          if (!item.spaces) {
            item.spaces = [];
          }
          return item;
        })

        dispatch({
          type: GET_BOOKING_VENUES_SUCCESS,
          payload: venues
        })

      } catch (err) {
        console.log("Get Venus Setting failed.")
        dispatch({ type: GET_BOOKING_VENUES_ERROR });
      }
    }

    getVenues();

  }, [])

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

  const handleClickSave = () => {
    let isValidate = true;
    Object.keys(state.validateForm).forEach(item => {
      if (state[item] === null || state[item].length === 0) {
        dispatch({ 
          type: UPDATE_ADD_BOOKINGFORM_VALIDATE, 
          payload: { key: item ,value: false }
        })
        isValidate = false;
      }
    })

    if (isValidate) {
      onEndEditing(state)
    }
  }

  return (
    <ModalContainer>
      <SpinnerContainer loading={state.loadingBookingDetilas.toString()} />
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3>{state.eventName || "New Booking"}</H3>
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
              onClick={handleClickSave}
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
    case REQUSET_GET_BOOKING_CUSTOMER: 
      return {
        ...state,
        loadingBookingDetilas: true,
      }
    case GET_BOOKING_CUSTOMER_SUCCESS:
      return {
        ...state,
        loadingBookingDetilas: false,
        customers: [ ...action.payload ]
      }
    case GET_BOOKING_CUSTOMER_ERROR:
      return {
        ...state,
        loadingBookingDetilas: false,
      }
    case REQUSET_GET_BOOKING_VENUES:
      return {
        ...state,
        loadingBookingDetilas: true,
      }
    case GET_BOOKING_VENUES_SUCCESS:
      return {
        ...state,
        loadingBookingDetilas: false,
        venues: [ ...action.payload ]
      }
    case GET_BOOKING_VENUES_ERROR:
      return {
        ...state,
        loadingBookingDetilas: false,
      }
    case REQUEST_GET_BOOKING_SPACES:
      return {
        ...state,
        loadingBookingDetilas: true,
      }
    case GET_BOOKING_SPACES_SUCCESS:
      return {
        ...state,
        loadingBookingDetilas: false,
        spaces: [ ...action.payload ]
      }
    case GET_BOOKING_SPACES_ERROR:
      return {
        ...state,
        loadingBookingDetilas: false,
      }
    case UPDATE_ADD_BOOKINGFORM_VALIDATE:{
      const newValidateForm = { ...state.validateForm };
      newValidateForm[action.payload.key] = action.payload.value;
      return {
        ...state,
        validateForm: { ...newValidateForm },
      }
    }      
    case "set_title": {
      const newValidateForm = { ...state.validateForm };
      newValidateForm.eventName = (action.value.length > 0);
      return { 
        ...state, 
        eventName: action.value,         
        validateForm: { ...newValidateForm }
      };
    }

    case "update_slot": {
      debugger;
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
            date: action.date || (new Date()).valueOf(),
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
      const newValidateForm = { ...state.validateForm };
      newValidateForm.venueId = (action.venue !== null);
      return {
        ...state,
        venueId: action.venue,
        space: null,
        validateForm: { ...newValidateForm },
      };
    }
    case "select_space": {
      const newValidateForm = { ...state.validateForm };
      newValidateForm.spaceId = (action.space !== null);
      return {
        ...state,
        spaceId: action.space,
        validateForm: newValidateForm,
      };
    }
    case "select_customer": {
      const newValidateForm = { ...state.validateForm };
      newValidateForm.customerId = (action.customer !== null);
      return {
        ...state,
        customerId: action.customer,
        validateForm: { ...newValidateForm },
      };
    }
    case "select_owner": {
      const newValidateForm = { ...state.validateForm };
      newValidateForm.ownerId = (action.owner !== null);
      return {
        ...state,
        ownerId: action.value,
        validateForm: { ...newValidateForm }
      };
    }

    default:
      throw new Error();
  }
}

export default BookingDetailEdit;
