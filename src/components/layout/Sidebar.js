import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import colors from "../style/colors";
import LayoutBlock from "../layout/LayoutBlock";
import P1 from "../typography/P1";
import SideCollapseRightSvg from "../../images/Glyphs/calendarExpand.svg";
import SideCollapseLeftSvg from "../../images/Glyphs/calendarCollapse.svg";

import CalendarSvg  from "../../images/sidebar/calendar.svg";
import BookingsSvg  from "../../images/sidebar/bookings.svg";
import InvoicesSvg  from "../../images/sidebar/invoices.svg";
import CustomersSvg from "../../images/sidebar/customers.svg";
import SettingsSvg  from "../../images/sidebar/settings.svg";
import LogOutSvg    from "../../images/sidebar/logout.svg";
import LogInSvg     from "../../images/sidebar/login.svg";
import RegisterSvg  from "../../images/sidebar/register.svg";

import constants from "./constants";
import CONFIG from "../../config";

import setAuthToken from "../../utils/setAuthToken";
import { AppReducerContext } from "../../contexts/AppReducerContext";

const Container = styled.div`
  ${LayoutBlock};
  position: sticky;
  float: left;
  top: 0;
  width: ${props => props.collapsed ? constants.collapseSidebarWidth : constants.sidebarWidth};
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
  min-height: 32px;
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
  height: 100% !important;
  justify-content: ${props => (props.logined ? 'space-between' : 'flex-end')};
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
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState(false)

  const logout = () => {
    setAuthToken("");
    dispatch({type: 'set_logout'});
    setTimeout(() => {
      window.location.replace(CONFIG.BASE_URL);
    }, 100)    
  }

  const login = () => {
    setAuthToken("");
    window.location.replace(CONFIG.BASE_URL + 'login');
  }

  const register = () => {
    setAuthToken("");
    window.location.replace(CONFIG.BASE_URL + 'register');    
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(state.auth.token && state.auth.token.length)
  }, [state.auth.token])

  return (
    <Container collapsed={sidebarCollapsed}>
      <SidebarWrapper logined={isLoggedIn}>        
        {
          ( isLoggedIn) ? (
            <React.Fragment>
              <div>
                <SidebarButton key={'sidebar-collapsed'}>
                  <img 
                    style={{width: '32px',}}
                    alt={'collapse'} 
                    src={sidebarCollapsed ? SideCollapseRightSvg : SideCollapseLeftSvg} 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  />
                </SidebarButton>
                {TopLinks.map(link => (
                  <SidebarButton
                    key={link.title}
                    selected={window.location.pathname === link.href}
                    onClick={() => history.push(link.href)}
                  >
                    <img alt={link.title} src={link.svg} />
                    { !sidebarCollapsed && <P1>{link.title}</P1>}                    
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
                    { !sidebarCollapsed && <P1>{link.title}</P1>}                    
                  </SidebarButton>
                ))}
                <SidebarButton
                  key={"logout"}
                  onClick={logout}
                >
                  <img alt="Log Out" src={LogOutSvg} />
                  { !sidebarCollapsed && <P1>Log Out</P1> }
                </SidebarButton>
              </div>
            </React.Fragment>
          ) : (
            <div>              
              <SidebarButton
                key={"register"}
                onClick={register}
              >
                <img alt="Log In" src={RegisterSvg} style={{width: '24px', height: '24px'}}/>
                { !sidebarCollapsed && <P1>Register</P1> }
              </SidebarButton>
              <SidebarButton
                key={"login"}
                onClick={login}
              >
                <img alt="Log In" src={LogInSvg} style={{width: '24px', height: '24px'}}/>
                { !sidebarCollapsed && <P1>Log In</P1> }
              </SidebarButton>
            </div>
          )
        }        
      </SidebarWrapper>
    </Container>
  );
};

export default withRouter(Sidebar);
