import React, { useContext, useEffect, useState } from "react";
import { cx, css } from "emotion";

import BigCalendar from "react-big-calendar";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/calendar.css";

import CalendarToolbar from "./calendarToolbar";
import CalendarWeekHeader from "./calendarWeekHeader";
import { formatEventStartEndTime } from "../../utils/dateFormatting";
import colors from "../style/colors";

import { AppReducerContext } from "../../contexts/AppReducerContext";

const localizer = BigCalendar.momentLocalizer(moment);

const Event = props => {
  const { event } = props;
  return (
    <>
      <p
        className={cx(
          "event-title",
          css`
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 14px;
            color: black;
            margin-top: 4px;
            margin-bottom: 0;
            color: ${colors.dark};
          `
        )}
      >
        {event.title}
      </p>
      <p
        className={cx(
          "event-subtitle",
          css`
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 14px;
            margin-top: 4px;
            margin-bottom: 0;
            color: ${event.accent};
          `
        )}
      >
        <FontAwesomeIcon className="fa-icons" icon={faUser} />&nbsp;&nbsp;&nbsp;
        {event.subtitle}
      </p>
      <p
        className={cx(
          "event-time",
          css`
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 13px;
            margin-top: 4px;
            color: ${colors.grey};
          `
        )}
      >
        {formatEventStartEndTime(event.start, event.end)}
      </p>
    </>
  );
};

const EventWrapper = props => {
  const { event, children } = props;

  return (
    <div
      onClick={props.onClick}
      className={css`
        .rbc-event {
          ::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: white;
            z-index: -2;
            border-radius: 2px;
          }
          ::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: ${event.accent}15;
            z-index: -1;
            border-radius: 2px;
          }
          z-index: 0;
          border: 1px solid ${event.accent} ;
          background-color: ${event.accent}15 !important;

          color: black;
          border-radius: 2px;
          left: 5px !important;
          right: 5px !important;
          width: calc(100% - 10px) !important;
        }
        .rbc-selected {
          background-color: ${event.accent}60 !important;
        }
        :active {
          opacity: 0.8;
        }
      `}
    >
      {children}
    </div>
  );
};

const Calendar = props => {
  // initially scrolling to this date gives the best experience for most users
  const today8am = new Date();
  today8am.setHours(8);
  today8am.setMinutes(30);
  
  const { state, dispatch } = useContext(AppReducerContext);
  const [resources, setResources] = useState([])
  useEffect(() => {
    if (state.calendarViews.curView === 'spaces')
      setResources([
        ...state.calendarViews.allSpaces.map(item => {
          return {id: item.id, title: item.name}
        })
      ])
    else  {
      if (
        state.calendarViews.calendarViewData && 
        state.calendarViews.calendarViewData.views &&
        state.calendarViews.curView >= 0
      ) {
        const newResources = state.calendarViews.calendarViewData.views[state.calendarViews.curView].spaces.map(item => {
          return {id: item.id, title: item.name}
        })
        setResources([...newResources])
      }
    }
  }, [
    state.calendarViews.curView, 
    state.calendarViews.calendarViewData, 
    state.calendarViews.allSpaces
  ])

  return (
    <BigCalendar
      scrollToTime={today8am}
      defaultView="week"
      views={["day", "week", "month"]}
      selectable={false} // prevent drag to create event in calendar
      localizer={localizer}
      defaultDate={new Date()}
      components={{
        event: Event,
        eventWrapper: EventWrapper,
        toolbar: CalendarToolbar,
        week: {
          header: CalendarWeekHeader
        }
      }}
      events={props.events || []}
      resources={resources}
      {...props}
    />
  );
};

export default Calendar;
