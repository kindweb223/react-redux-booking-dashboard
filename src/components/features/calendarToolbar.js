import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import arrowRight from "../../images/ui/arrowRight.svg";
import arrowLeft from "../../images/ui/arrowLeft.svg";
import styled from "styled-components";
import SvgButton from "../buttons/SvgButton";
import Button from "../buttons/Button";
import ButtonsRow from "../layout/ButtonsRow";
import expandGlyph from "../../images/Glyphs/calendarExpand.svg";
import collapseGlyph from "../../images/Glyphs/calendarCollapse.svg";
import PickerButton from "../buttons/PickerButton";
import colors from "../style/Colors.js";
import Modal from "../modals/Modal"
import CalendarViewDropDown from './CalendarViewDropDown'
import CalendarCreateView from "../features/CalendarCreateView"
import { AppReducerContext } from "../../contexts/AppReducerContext";
import CalendarDatePicker from './CalendarDatePicker';

import axios from 'axios';

import { 
  CREATE_CALENDAR_SETTING_SUCCESS, CREATE_CALENDAR_SETTING_ERROR,
  UPDATE_CALENDAR_SETTING_SUCCESS, UPDATE_CALENDAR_SETTING_ERROR,
  SET_CALENDAR_SETTING_DATA,
} from '../../reducers/actionType'
import { setCalendarSettingAction } from '../../actions/calendar'

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const CalendarToolbar = props => {
  const { date, view: currentView, views, onNavigate, history } = props;

  const { state, dispatch } = useContext(AppReducerContext)

  const [showCreateViewModal, setShowCreateViewModal] = useState(false)

  return (
    <Container
      style={{
        justifyContent: "space-between",
        marginBottom: 22
      }}
    >
      <Container>
        <SvgButton
          svg={!state.calendarSettings.viewExpand ? expandGlyph : collapseGlyph}
          width={22}
          height={22}
          onClick={() => setCalendarSettingAction(dispatch, {...state.calendarSettings, viewExpand: !state.calendarSettings.viewExpand})}
          style={{ marginRight: 14 }}
        />
        <Button
          style={{ margin: "0 1em 0 0" }}
          onClick={() => setCalendarSettingAction(
            dispatch,
            {
              ...state.calendarSettings,
              selectedDate: new Date(),
              viewMode: 'day',
            }
          )}
        >
          Today
        </Button>
        <SvgButton
          svg={arrowLeft}
          width={20}
          height={20}
          onClick={() => onNavigate("PREV")}
          style={{ marginRight: 7 }}
        />
        <SvgButton
          svg={arrowRight}
          width={20}
          height={20}
          onClick={() => onNavigate("NEXT")}
        />
        <CalendarDatePicker title={formatDate(date, currentView)} />
      </Container>

      <Container>
        <ButtonsRow>
          {views.map(view => {
            return (
              <Button
                key={view}
                onClick={() => setCalendarSettingAction(
                  dispatch, 
                  {
                    ...state.calendarSettings, 
                    viewMode: view,
                  }
                )}
                selected={view === currentView}
                style={{textTransform: 'capitalize'}}
              >                
                {view}
              </Button>
            );
          })}
        </ButtonsRow>
      </Container>      
      
      <CalendarViewDropDown 
        views={state.calendarViews.calendarViewData.views ? state.calendarViews.calendarViewData.views : []}
        showCreateViewModalFunc = {(bShow) => setShowCreateViewModal(bShow)}
      />

      {
        showCreateViewModal && (
          <Modal 
            isOpen={showCreateViewModal} 
            onClose={() => setShowCreateViewModal(false)}>
            <CalendarCreateView 
              hideModal={() => {setShowCreateViewModal(false)}}
            />
          </Modal>
        )
      }      
    </Container>
  );
};

function formatDate(date, view) {
  switch (view) {
    case "day":
      return moment(date).format("dddd, Do of MMMM YYYY");
    case "week": {
      const firstDayOfWeek = moment(date).startOf('week')
      const lastDayOfWeek = moment(date).endOf('week')
      if (firstDayOfWeek.year() !== lastDayOfWeek.year()) {
        return firstDayOfWeek.format('Do of MMMM YYYY') + " - " + lastDayOfWeek.format('Do of MMMM YYYY')
      } else {
        return firstDayOfWeek.format('Do of MMMM ') + " - " + lastDayOfWeek.format('Do of MMMM')      
      }
    }      
    case "month":
      return moment(date).format("MMMM YYYY");
    default:
      return moment(date).format("dddd, MMMM D, YYYY");
  }
}

export default withRouter(CalendarToolbar);
