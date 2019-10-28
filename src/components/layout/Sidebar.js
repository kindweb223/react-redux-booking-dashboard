import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import colors from "../style/colors";
import LayoutBlock from "../layout/LayoutBlock";
import P1 from "../typography/P1";
import CalendarSvg from "../../images/sidebar/calendar.svg";
import BookingsSvg from "../../images/sidebar/bookings.svg";
import InvoicesSvg from "../../images/sidebar/invoices.svg";
import CustomersSvg from "../../images/sidebar/customers.svg";
import SettingsSvg from "../../images/sidebar/settings.svg";
import LogOutSvg from "../../images/sidebar/logout.svg";
import constants from "./constants";
import CONFIG from "../../config";

import setAuthToken from "../../utils/setAuthToken";
import { AppReducerContext } from "../../contexts/AppReducerContext";

const Container = styled.div`
  ${LayoutBlock};
  position: sticky;
  float: left;
  top: 0;
  width: ${constants.sidebarWidth};
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  background: ${colors.ultra_dark};
  min-height: 100vh;
  color: white;
  display: grid;
  > div {
    width: 100%;
  }
  @media (max-width: 900px) {
    width: auto;
  }
`;

const SidebarButton = styled.div`
  display: grid;
  grid-template-columns: 2.5em 1fr;
  align-items: center;
  margin-bottom: 1em;
  cursor: pointer;
  p {
    margin: 0;
    color: ${props => (props.selected ? "white" : "")};
    line-height: 2;
  }
  @media (max-width: 900px) {
    p {
      display: none;
    }
    grid-template-columns: 1fr;
  }
  ${props =>
    props.selected &&
    `
    @media (max-width: 900px) {
      img {
        filter: brightness(2);
      }
    }
  `}
  ${props =>
    !props.selected &&
    `
    @media (max-width: 900px) {
      img {
        opacity: .8;
      }
    }
  `}
`;

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100% !important;
`;

const TopLinks = [
  { title: "Calendar", svg: CalendarSvg, href: "/calendar" },
  { title: "Bookings", svg: BookingsSvg, href: "/bookings" },
  { title: "Customers", svg: CustomersSvg, href: "/customers" },
  { title: "Invoices", svg: InvoicesSvg, href: "/invoices" }
];
const BottomLinks = [
  { title: "Settings", svg: SettingsSvg, href: "/settings" },
];

const Sidebar = props => {
  const { history } = props;
  const { state, dispatch } = useContext(AppReducerContext);

  const logout = () => {
    setAuthToken("");
    dispatch({type: 'set_logout'});
    setTimeout(() => {
      window.location.replace(CONFIG.BASE_URL);
    }, 100)    
  }

  return (
    <Container>
      <SidebarWrapper>
        <div>
          {TopLinks.map(link => (
            <SidebarButton
              key={link.title}
              selected={window.location.pathname === link.href}
              onClick={() => history.push(link.href)}
            >
              <img alt={link.title} src={link.svg} />
              <P1>{link.title}</P1>
            </SidebarButton>
          ))}
        </div>
        <div>
          {BottomLinks.map(link => (
            <SidebarButton
              key={link.title}
              selected={window.location.pathname === link.href}
              onClick={
                () => link.href && history.push(link.href)
              }
            >
              <img alt={link.title} src={link.svg} />
              <P1>{link.title}</P1>
            </SidebarButton>
          ))}
          <SidebarButton
            key={"logout"}
            onClick={logout}
          >
            <img alt="Log Out" src={LogOutSvg} />
            <P1>Log Out</P1>
          </SidebarButton>
        </div>
      </SidebarWrapper>
    </Container>
  );
};

export default withRouter(Sidebar);
