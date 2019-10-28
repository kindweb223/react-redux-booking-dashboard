import React, { useContext, useEffect } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import jsonwebtoken from 'jsonwebtoken';

import SpinnerContainer from '../components/layout/Spinner';

import styled from "styled-components";

import "../css/validate.css";

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
  
  useEffect(() => {
    const indexStr = 'access_token=';
    const href = window.location.href;
    const nIndex = href.indexOf(indexStr);
    if( nIndex >= 0) {
      const accessToken = href.substring(nIndex + indexStr.length, href.length);

      if(accessToken.length > 0) {

        const decoded = jsonwebtoken.decode(accessToken);

        const values = {
          outseta_id: decoded.nameid,
          email: decoded.unique_name,
          firstName: decoded.family_name,
          lastName: decoded.given_name,
        };
        // const values = {
        //   outseta_id: "111222333",
        //   email: "test1026@test.com",
        //   firstName: "Test1026",
        //   lastName: "Test1026",
        // };

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
            
            if(res.data.success) {
              dispatch({
                type: 'get_login_success',
                payload: {...res.data},
              })
            }
          } catch (err) {
            dispatch({
              type: 'get_login_error',
              payload: {...values},
            })
            window.location.replace("https://heyagenda.com/");
          }
        }

        loginOutSeta();
      }else {
        window.location.replace("https://heyagenda.com/");
      }
    } else {
      window.location.replace("https://heyagenda.com/");
    }

  }, [])
  
  const { state, dispatch } = useContext(AppReducerContext);

  if(state.auth.isAuthenticated) {
    return <Redirect to='/calendar' />;
  }

  return (
    <Container>
      <SpinnerContainer loading={"true"} />
    </Container>
  )
}

export default LoginPage;
