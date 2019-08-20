import React, { useState, useContext } from "react";
import axios from 'axios';
import styled from "styled-components";
import H3 from "../../typography/H3";
import TabBar from "../tabBar";
import colors from "../../style/colors";
import Button from "../../buttons/Button";
import PickerButton from "../../buttons/PickerButton";
import BookingDetailEdit from "./bookingDetailEdit";
import {
  AppReducerContext,
  getStatuColor,
} from "../../../contexts/AppReducerContext";
import DetailsSection from "./sections/details";
import QuotesSection from "./sections/quotes";
import InvoicesSection from "./sections/invoices";

import {
  REQUEST_UPDATE_BOOKING,
  GET_UPDATE_BOOKING_SUCCESS,
  GET_UPDATE_BOOKIG_ERROR,
} from "../../../reducers/actionType";

const TABBAR_ITEM_DETAILS = "Details";
const TABBAR_ITEM_QUOTES = "Quotes";
const TABBAR_ITEM_INVOICES = "Invoices";
const TABBAR_ITEMS = [
  TABBAR_ITEM_DETAILS,
  TABBAR_ITEM_QUOTES,
  TABBAR_ITEM_INVOICES
];

function renderSelectedSection(sectionName, props, setSelectedTab) {
  switch (sectionName) {
    case TABBAR_ITEM_DETAILS:
      return <DetailsSection {...props} />;
    case TABBAR_ITEM_QUOTES:
      return (
        <QuotesSection
          {...props}
          onQuoteConverted={() => setSelectedTab(TABBAR_ITEM_INVOICES)}
        />
      );
    case TABBAR_ITEM_INVOICES:
      return <InvoicesSection {...props} />;
    default:
      throw new Error(`${sectionName} is not a valid section name`);
  }
}

const Container = styled.div`
  background-color: ${colors.lightest};
  width: 100%;
  height: 100%;
  overflow: scroll;
  border-radius: 0.5em;
  box-shadow: 0px 13px 32px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
`;

const TopSection = styled.div`
  background-color: white;
  position: sticky;
  top: 0;
  border-radius: 0.25em 0.25em 0 0;
`;

const TitleAndButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px 15px;
  padding-top: 20px;
`;

const BottomSection = styled.div`
  width: 100%;
  flex: 1 1 auto;
  display: flex;
`;

const BottomSectionWrapper = styled.div`
  width: 100%;
  padding: 20px 20px 15px;
  overflow: scroll;
`;

const BookingDetail = props => {
  const { booking } = props;

  const [selectedTab, setSelectedTab] = useState(
    TABBAR_ITEM_DETAILS,
    TABBAR_ITEM_QUOTES,
    TABBAR_ITEM_INVOICES
  );
  const [editing, setEditing] = useState(false);
  const { state, dispatch } = useContext(AppReducerContext);

  const handleUpdateBooking = async (updateBooking) => {
    if (updateBooking) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      try {
        dispatch({ type: REQUEST_UPDATE_BOOKING })
        
        const res = await axios.put(
          `/bookings/${booking.id}`, 
          { 
            eventName: updateBooking.eventName,
            venueId: updateBooking.venueId,
            spaceId: updateBooking.spaceId,
            customerId: updateBooking.customerId,
            ownerId: updateBooking.ownerId,
            statusId: updateBooking.statusId,
            slots: JSON.stringify(updateBooking.slots),            
          },
          config
        );
  
        dispatch({ 
          type: GET_UPDATE_BOOKING_SUCCESS,
          payload: res.data.booking
        })
      } catch (err) {
        dispatch({ type: GET_UPDATE_BOOKIG_ERROR});
      }
    }
    setEditing(false);
  }

  const handleChangeStatus = async (status) => {
    try { 

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      dispatch({ type: REQUEST_UPDATE_BOOKING })
      const filteredStatus = state.bookings.bookingStatus.filter(item => item.name === status )

      const res = await axios.put(
        `/bookings/${booking.id}`, 
          { 
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: booking.customerId,
            ownerId: booking.ownerId,
            statusId: filteredStatus[0].id,
            slots: JSON.stringify(booking.slots),            
          },
          config
        );

      dispatch({ 
        type: GET_UPDATE_BOOKING_SUCCESS,
        payload: res.data.booking
      })
    } catch (err) {
      dispatch({ type: GET_UPDATE_BOOKIG_ERROR});
    }
  }

  if (!booking) {
    return null;
  }

  if (editing) {
    return (
      <BookingDetailEdit
        booking={booking}
        onEndEditing={booking => {
          handleUpdateBooking(booking);
        }}d
      />
    );
  }

  
  return (
    <Container>
      <TopSection>
        <TitleAndButtons>
          <H3>{booking.eventName}</H3>
          <div>
            <PickerButton
              style={{ minWidth: 120, marginRight: 10 }}
              options={state.bookings.bookingStatus.map(item => item.name)}
              colors={state.bookings.bookingStatus.map(item => getStatuColor(item.name))}
              selectedOption={booking.status.name}
              onOptionSelected={opt =>
                handleChangeStatus(opt)                
              }
            />
            <Button primary onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>
        </TitleAndButtons>

        <TabBar
          items={TABBAR_ITEMS}
          selectedItem={selectedTab}
          onOptionSelected={setSelectedTab}
          itemsSideMargin={20}
        />
      </TopSection>

      <BottomSection>
        <BottomSectionWrapper>
          {renderSelectedSection(selectedTab, { booking }, setSelectedTab)}
        </BottomSectionWrapper>
      </BottomSection>
    </Container>
  );
};

export default BookingDetail;
