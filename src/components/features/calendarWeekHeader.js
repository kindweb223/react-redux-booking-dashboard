import React from "react";
import moment from "moment";
import styled from "styled-components";
import colors from "../style/Colors";
import isToday from "../../utils/isToday";

const CalendarWeekHeader = props => {
  const { date } = props;

  const isDateToday = isToday(date);
  const weekDay = moment(date).format("ddd");
  const monthDay = moment(date).format("D");

  const WeekDay = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    margin-top: 14px;
    text-align: center;
    letter-spacing: 0.02em;
    color: ${isDateToday ? colors.accent_pink : colors.grey};
  `;
  const MonthDay = styled.div`
    display: inline-block;

    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 28px;
    margin-top: 11px;
    margin-bottom: 14px;

    background-color: ${isDateToday ? colors.accent_pink : "clear"};
    border-radius: 20px;
    min-width: 40px;
    min-height: 40px;
    line-height: 40px;

    color: ${isDateToday ? "white" : colors.grey};
  `;

  return (
    <>
      <WeekDay>{weekDay}</WeekDay>
      <MonthDay>{monthDay}</MonthDay>
    </>
  );
};

export default CalendarWeekHeader;
