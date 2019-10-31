import React, { useContext } from "react";
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
  const { date, view: currentView, views, onView, onNavigate } = props;

  const { calendarExpanded, setCalendarExpanded } = useContext(CalendarContext);

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

export default CalendarToolbar;
