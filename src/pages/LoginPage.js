import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {loadUserflow} from 'userflow.js'
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import SpinnerContainer from '../components/layout/Spinner';
import styled from "styled-components";
import "../css/validate.css";
import CONFIG from "../config";
import { CALENDAR_REDIRECT_VALUE } from "../constants"

import {
  AppReducerContext,
} from "../contexts/AppReducerContext";

const LoginPage = props => {

  const Container = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const { dispatch } = useContext(AppReducerContext);

  useEffect(() => {
    const indexStr = 'access_token=';
    const href = window.location.href;
    const nIndex = href.indexOf(indexStr);
    if( nIndex >= 0) {
      let accessToken = '';
      let calendarInfo = '';

      if (window.location.href.indexOf('start=') > 0) {
        accessToken = href.substring(nIndex + indexStr.length, href.length)
        calendarInfo = href.substring(
          window.location.href.indexOf('start='), 
          window.location.href.indexOf(indexStr)
        )
      } else
        accessToken = href.substring(nIndex + indexStr.length, href.length);

      if(accessToken.length > 0) {

        const decoded = jsonwebtoken.decode(accessToken);

        const values = {
          outseta_id: decoded.nameid,
          email: decoded.unique_name,
          firstName: decoded.family_name,
          lastName: decoded.given_name,
        };

        const loginOutSeta = async () => {
          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
          
          try {
            const res = await axios.post(
              '/auth/login',
              JSON.stringify(values),
              config
            );
            
            if (res.data.success) {
              dispatch({
                type: 'get_login_success',
                payload: {...res.data},
              })
            }

            if (res.data.user.is_new) {
              const userflow = await loadUserflow()
              userflow.init('ytb6m37wn5drnj2zkxptyvke6i')
              userflow.identify(res.data.user.id, {
                name: `${res.data.user.firstName} ${res.data.user.lastName}`,
                email: res.data.user.email,
                signedUpAt: res.data.user.createdAt,
              })
              userflow.startFlow('d496295e-ae0c-4c03-83c8-9794fcac74ed')
            }else {
              if (calendarInfo.length > 0)
                props.history.push('/calendar?' + calendarInfo)
              else props.history.push('/calendar')
            }

          } catch (err) {
            dispatch({
              type: 'get_login_error',
              payload: {...values},
            })
            window.location.replace(CONFIG.BASE_URL);
          }
        }

        loginOutSeta();
      }else {
        window.location.replace(CONFIG.BASE_URL);
      }
    } else {
      window.location.replace(CONFIG.BASE_URL);
    }

  }, [])  

  return (
    <Container>
      <SpinnerContainer loading={"true"} />
    </Container>
  )
}

export default withRouter(LoginPage);
