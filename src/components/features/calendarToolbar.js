import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import H3 from "../typography/H3";
import arrowRight from "../../images/ui/arrowRight.svg";
import arrowLeft from "../../images/ui/arrowLeft.svg";
import styled, { keyframes } from "styled-components";
import SvgButton from "../buttons/SvgButton";
import Button from "../buttons/Button";
import ButtonsRow from "../layout/ButtonsRow";
import expandGlyph from "../../images/Glyphs/calendarExpand.svg";
import collapseGlyph from "../../images/Glyphs/calendarCollapse.svg";
import CalendarContext from "../../contexts/CalendarContext";
import PickerButton from "../buttons/PickerButton";
import arrowDown from "../../images/ui/arrowDown.svg";
import colors from "../style/colors.js";
import CircleAddGlyph from "../../images/Glyphs/CircleAddGlyph";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Modal from "../modals/modal"
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

const loadingAni = keyframes`
  50% {
    opacity: .35;
  }
`;

const ViewsButton = styled.div`
  display: flex;
  position: relative;
`;

const WrapperButton = styled(Button)`
  p {
    display: flex;
  }
`;

const ViewDropDown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  display: ${props => (props.isOpen? 'flex' : 'none')};
  background-color: #f9f9f9;
  color: ${colors.grey}
  box-shadow: 0px 1.5px 1px rgba(0,0,0,0.05);
  padding: 5px 10px;
  border: 1px solid #E6E8E9;
  border-radius: 0.25em;
  z-index: 1;

  ul {
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      list-style: none;
      color: ${colors.grey};
      white-space: nowrap;
      font-size: 0.9rem;
      font-weight: normal;
      cursor: pointer;
      margin: 0.3rem 0;
    }
  }
`;

const ViewTitle = styled.p`
  font-size: 0.8rem;
  color: ${colors.grey};
  margin: 1rem 0 0.5rem;
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

  const [openViewDropDown, setOpenViewDropDown] = useState(false);
  const handleClickViews = () => {
    setOpenViewDropDown(!openViewDropDown)
  }

  const handleClickCalendarView = calendarViewId => {
    console.log(calendarViewId);
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
      

      <ViewsButton>
        <WrapperButton onClick={handleClickViews}>
          Views
          <img
            src={arrowDown}
            alt="Show options"
            style={{ transform: openViewDropDown ? "scaleY(-1)" : "", marginLeft: 5 }}
          />
        </WrapperButton>
        <ViewDropDown isOpen={openViewDropDown}>
          <ul>
            <li onClick={() => history.push('/settings')}>
              <CircleAddGlyph side={16} fill={colors.grey} />&nbsp;&nbsp;Create another space
            </li>
            <ViewTitle>Views</ViewTitle>
            <li>All Spaces</li>
            {state.calendarViews.calendarViews.map((item, nIndex) => {
              return <li key={item.id} onClick={() => handleClickCalendarView(item.id)}>
                {item.title}
              </li>
            })}
            <li onClick={() => setShowCreateViewModal(true)}>
              <FontAwesomeIcon className="fa-icons" icon={faPencilAlt} />
              &nbsp;&nbsp;Manage Views
            </li>
          </ul>
        </ViewDropDown>
      </ViewsButton>
      
      {
        showCreateViewModal && (
          <Modal 
            isOpen={showCreateViewModal} 
            onClose={() => setShowCreateViewModal(false)}>
            <CalendarCreateView calendarViewData={state.calendarViews.calendarViewData} />
          </Modal>
        )
      }      
    </Container>
  );
};

function formatDate(date, view) {
  switch (view) {
    case "day":
      return moment(date).format("MMMM Do");
    case "week":
      return moment(date).format("MMMM 'YY");
    case "month":
      return moment(date).format("MMMM 'YY");
    default:
      return moment(date).format("MMMM Do 'YY");
  }
}

export default withRouter(CalendarToolbar);
