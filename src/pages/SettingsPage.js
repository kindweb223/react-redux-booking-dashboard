import React, { useContext, useState } from "react";
import SideNavigation from "../components/features/sideNavigation";
import constants from "../components/layout/constants";
import Grid from "../components/layout/Grid";
import { AppReducerContext } from "../contexts/AppReducerContext";
import CompanyInfoSettingsSection from "../components/settings/sections/CompanyInfo";
import BookingStatusesSettingsSection from "../components/settings/sections/BookingStatuses";
import VenuesAndSpacesPage from "./VenuesAndSpacesPage";

const VENUES_AND_SPACES_SECTION_NAME = "Venues and Spaces";
const COMPANY_SETTINGS_SECTION_NAME = "Company Settings";
const BOOKING_STATUS_SECTION_NAME = "Booking Status";

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
          COMPANY_SETTINGS_SECTION_NAME
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
          default:
            throw new Error("unhandled section");
        }
      })()}
    </Grid>
  );
};

export default SettingsPage;
