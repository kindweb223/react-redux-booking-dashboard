import React, { useContext, useState } from "react";
import SideNavigation from "../components/features/sideNavigation";
import constants from "../components/layout/constants";
import Grid from "../components/layout/Grid";
import { AppReducerContext } from "../contexts/AppReducerContext";
import CompanyInfoSettingsSection from "../components/settings/sections/CompanyInfo";
import BookingStatusesSettingsSection from "../components/settings/sections/BookingStatuses";
import CustomBookingColorSection from "../components/settings/sections/CustomBookingColor";
import VenuesAndSpacesPage from "./VenuesAndSpacesPage";
import OnlinePaymentPage from "./OnlinePaymentPage";
import BookingWidgetPage from "./BookingWidgetPage";
import SuggestionPage from "../components/settings/sections/Suggestion"

const VENUES_AND_SPACES_SECTION_NAME  = "Venues and Spaces";
const COMPANY_SETTINGS_SECTION_NAME   = "Company Settings";
const BOOKING_STATUS_SECTION_NAME     = "Booking Status";
const ONLINE_PAYMENT_SECTION_NAME     = "Online Payments";
const CUSTOM_BOOKING_COLOR_NAME       = "Custom Booking Colour";
const GET_BOOKING_WIDGET              = "Get Booking Widget"
const SUGGESTIONS_TAB                 = "Suggestion"

const SettingsPage = props => {
  const [currentSection, setCurrentSection] = useState(
    VENUES_AND_SPACES_SECTION_NAME
  );
  const { state: globalState, dispatch } = useContext(AppReducerContext);
  const state = globalState.settings;  

  return (
    <Grid fullheight columns={`${constants.leftPanelWidth} 1fr`}>
      <SideNavigation
        selectedItem={currentSection}
        items={[
          VENUES_AND_SPACES_SECTION_NAME,
          BOOKING_STATUS_SECTION_NAME,
          COMPANY_SETTINGS_SECTION_NAME,
          ONLINE_PAYMENT_SECTION_NAME,
          CUSTOM_BOOKING_COLOR_NAME,
          GET_BOOKING_WIDGET,
          SUGGESTIONS_TAB,
        ]}
        onClick={item => {
          setCurrentSection(item);
        }}
      />
      {(() => {
        switch (currentSection) {
          case COMPANY_SETTINGS_SECTION_NAME:
            return (
              <CompanyInfoSettingsSection state={state} dispatch={dispatch} />
            );
          case BOOKING_STATUS_SECTION_NAME:
            return (
              <BookingStatusesSettingsSection
                state={state}
                dispatch={dispatch}
              />
            );
          case VENUES_AND_SPACES_SECTION_NAME:
            return <VenuesAndSpacesPage state={state} dispatch={dispatch} />;
          case ONLINE_PAYMENT_SECTION_NAME:
            return <OnlinePaymentPage state={state} dispatch={dispatch} />;
          case CUSTOM_BOOKING_COLOR_NAME:
            return <CustomBookingColorSection />
          case GET_BOOKING_WIDGET:
            return <BookingWidgetPage />
          case SUGGESTIONS_TAB:
            return <SuggestionPage />
          default:
            throw new Error("unhandled section");
        }
      })()}
    </Grid>
  );
};

export default SettingsPage;
