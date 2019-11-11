import React, { useContext, useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import styled from "styled-components";
import colors from "../style/colors.js";
import Button from "../buttons/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import arrowDown from "../../images/ui/arrowDown.svg";
import CircleAddGlyph from "../../images/Glyphs/CircleAddGlyph";

import { AppReducerContext } from "../../contexts/AppReducerContext";
import { SET_CURRENT_CALENDAR_VIEW } from '../../reducers/actionType';

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
  z-index: 9;

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
      &:hover {
        opacity: 0.7;
      }
    }

    .divide-line {
      border-bottom: 1px solid #E6E8E9;
      margin: 0.8rem 0;
    }
  }
`;

const ViewTitle = styled.p`
  font-size: 0.8rem;
  color: ${colors.grey};
  margin: 1rem 0 0.5rem;
`;

const CalendarViewDropDown = ({
  history,
  views,
  showCreateViewModalFunc,  
  setCurView,
}) => {

  const {state, dispatch} = useContext(AppReducerContext)  
  const [openViewDropDown, setOpenViewDropDown] = useState(false)

  const refOne = useRef(null);
  useEffect(() => {
    const handleDocumentClick = event => {
      if (refOne.current) {
        if (!ReactDOM.findDOMNode(refOne.current).contains(event.target)) {
          if (openViewDropDown) {
            setOpenViewDropDown(false);
          }
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, false);

    return () => {
      document.removeEventListener("click", handleDocumentClick, false);
    };
  }, [refOne, openViewDropDown]);

  const handleClickView = nView => {
    if (nView === state.calendarViews.curView)
      return;
    dispatch({
      type: SET_CURRENT_CALENDAR_VIEW,
      payload: nView
    })
  }

  const getSelectedViewTitle = () => {
    if (state.calendarViews.curView === 'spaces')
      return 'Spaces';
    else return state.calendarViews.calendarViewData.views[state.calendarViews.curView].title;
  }

  return (
    <ViewsButton ref={refOne}>
      <WrapperButton onClick={() => setOpenViewDropDown(!openViewDropDown)}>
        {getSelectedViewTitle()}
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
          <div className="divide-line"></div>
          <ViewTitle>Views</ViewTitle>
          <li onClick={() => {setOpenViewDropDown(false); handleClickView('spaces');}}>All Spaces</li>

          {views.map((item, nIndex) => {
            return <li key={nIndex} onClick={() => {setOpenViewDropDown(false); handleClickView(nIndex);}}>
              {item.title}
            </li>
          })}
          <div className="divide-line"></div>
          <li onClick={() => {setOpenViewDropDown(false); showCreateViewModalFunc(true);}}>
            <FontAwesomeIcon className="fa-icons" icon={faPencilAlt} />
            &nbsp;&nbsp;Manage Views
          </li>
        </ul>
      </ViewDropDown>
    </ViewsButton>
  )
}

export default withRouter(CalendarViewDropDown)