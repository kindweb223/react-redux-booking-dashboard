import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import H3 from "../typography/H3";
import arrowRight from "../../images/ui/arrowRight.svg";
import arrowLeft from "../../images/ui/arrowLeft.svg";
import styled from "styled-components";
import SvgButton from "../buttons/SvgButton";
import Button from "../buttons/Button";
import ButtonsRow from "../layout/ButtonsRow";
import expandGlyph from "../../images/Glyphs/calendarExpand.svg";
import collapseGlyph from "../../images/Glyphs/calendarCollapse.svg";
import CalendarContext from "../../contexts/CalendarContext";
import PickerButton from "../buttons/PickerButton";
import colors from "../style/colors.js";
import Modal from "../modals/modal"
import CalendarViewDropDown from './CalendarViewDropDown'
import CalendarCreateView from "../features/CalendarCreateView"
import { AppReducerContext } from "../../contexts/AppReducerContext";

const Container = styled.div`
  display: flex;
  align-items: center;
  h3 {
    margin: 0;
  }
`;

const ResponsiveContainer = styled.div`
  @media (max-width: 1020px) {
    display: none;
  }
`;

const CalendarToolbar = props => {
  const { date, view: currentView, views, onView, onNavigate, history } = props;

  const { calendarExpanded, setCalendarExpanded } = useContext(CalendarContext);
  const { state, dispatch } = useContext(AppReducerContext)

  const [showCreateViewModal, setShowCreateViewModal] = useState(false)

  const handleClickToday = () => {
    if (currentView !== 'day')
      onView('day')
    onNavigate('TODAY')
  }

  return (
    <Container
      style={{
        justifyContent: "space-between",
        marginBottom: 22
      }}
    >
      <Container>
        <SvgButton
          svg={!calendarExpanded ? expandGlyph : collapseGlyph}
          width={22}
          height={22}
          onClick={() => setCalendarExpanded(!calendarExpanded)}
          style={{ marginRight: 14 }}
        />
        <Button
          style={{ margin: "0 1em 0 0" }}
          onClick={handleClickToday}
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
        <ResponsiveContainer>
          <H3 style={{ marginLeft: 15 }}>{formatDate(date, currentView)} </H3>{" "}
        </ResponsiveContainer>
      </Container>

      <Container>
        <ButtonsRow>
          {views.map(view => {
            return (
              <Button
                key={view}
                onClick={() => onView(view)}
                selected={view === currentView}
              >
                {view.slice(0, 1).toUpperCase() + view.slice(1, 99)}
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
              calendarViewData={state.calendarViews.calendarViewData} 
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
      return moment(date).format("dddd, MMMM D, YYYY");
    case "week": {
      const firstDayOfWeek = moment(date).startOf('week')
      const lastDayOfWeek = moment(date).endOf('week')
      if (firstDayOfWeek.year() !== lastDayOfWeek.year()) {
        return firstDayOfWeek.format('YYYY MMM D') + " - " + lastDayOfWeek.format('YYYY MMM D')
      } else if (firstDayOfWeek.month() !== lastDayOfWeek.month()) {
        return firstDayOfWeek.format('MMMM D') + " - " + lastDayOfWeek.format('MMMM D')
      } else {
        return firstDayOfWeek.format('MMMM D') + " - " + lastDayOfWeek.format('D')
      }
    }      
    case "month":
      return moment(date).format("MMMM YYYYY");
    default:
      return moment(date).format("dddd, MMMM D, YYYY");
  }
}

export default withRouter(CalendarToolbar);
