import React, { useState, useContext } from "react";
import styled from "styled-components";
import H3 from "../../typography/H3";
import TabBar from "../tabBar";
import colors from "../../style/colors";
import Button from "../../buttons/Button";
import PickerButton from "../../buttons/PickerButton";
import BookingDetailEdit from "./bookingDetailEdit";
import {
  AppReducerContext,
  statusesNameAndColors
} from "../../../contexts/AppReducerContext";
import DetailsSection from "./sections/details";
import QuotesSection from "./sections/quotes";
import InvoicesSection from "./sections/invoices";

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
    TABBAR_ITEM_DETAILS
    // TABBAR_ITEM_QUOTES
    // TABBAR_ITEM_INVOICES
  );
  const [editing, setEditing] = useState(false);
  const { state, dispatch } = useContext(AppReducerContext);

  const [bookingStatesNames, bookingStatesColors] = statusesNameAndColors(
    state
  );

  if (!booking) {
    return null;
  }

  if (editing) {
    return (
      <BookingDetailEdit
        booking={booking}
        onEndEditing={booking => {
          if (booking) {
            dispatch({ type: "upsert_booking", booking: booking });
          }
          setEditing(false);
        }}
      />
    );
  }

  return (
    <Container>
      <TopSection>
        <TitleAndButtons>
          <H3>{booking.title}</H3>
          <div>
            <PickerButton
              style={{ minWidth: 120, marginRight: 10 }}
              colors={bookingStatesColors}
              options={bookingStatesNames}
              selectedOption={booking.status}
              onOptionSelected={opt =>
                dispatch({
                  type: "update_booking_status",
                  id: booking.id,
                  status: opt
                })
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
