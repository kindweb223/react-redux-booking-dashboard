import React, { useState, useContext } from "react";
import { Formik } from "formik";
import * as EmailValidator from "email-validator";
import * as Yup from "yup";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import Button from "../components/buttons/Button";
import InputField from "../components/buttons/InputField";
import InputLabel from "../components/buttons/InputLabel";
import H3 from "../components/typography/H3";
import P2 from "../components/typography/P2";
import Grid from "../components/layout/Grid";

import styled from "styled-components";
import colors from "../components/style/colors";

import "../css/validate.css";

import {
  AppReducerContext,
} from "../contexts/AppReducerContext";
import { cx } from "emotion";

const LoginPage = props => {

  const Container = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-form {
      width: 300px;      
      min-height: 320px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .login-title {
      text-align: center;
    }

    .invalite_user_pwd {
      margin-bottom: 1em;
    }

  `;

  const [isValid, setIsValid] = useState(true);
  const { state, dispatch } = useContext(AppReducerContext);

  return (
    <Container>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setSubmitting }) => {

          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };

          const res = await axios.post(
            'http://justvenue.herokuapp.com/v1/api/auth/login',
            JSON.stringify(values), 
            config
          );
          debugger;
          if(res.data.status === 'success') {
            dispatch({
              type: 'get_login_result'              
            })
          }else {
            
          } 
          setSubmitting(false);         
        }}

        validationSchema={Yup.object().shape({
          email: Yup.string().email().required("Email Required"),            
          password: Yup.string()
            .required("Password Required.")
            .min(8, "Password is too short - should be 8 chars minimum.")
            .matches(/(?=.*[0-9])/, "Password must contain a number.")
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          return (
              <form className="login-form" onSubmit={handleSubmit}>
                <H3 className="login-title">Login</H3>
                { !isValid && <P2 className="invalite_user_pwd" color="accent_pink" center={true} >Invalid Username and Password</P2>}                
                <Grid>
                  <div className="form-group">
                    <InputLabel>Email</InputLabel>
                    <InputField
                      name="email"
                      type="text"
                      placeholder="Enter your email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.email && touched.email && cx("error")}
                    />
                    {errors.email && touched.email && (
                      <div className={cx("input-feedback")}>{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <InputLabel>Password</InputLabel>
                    <InputField
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.password && touched.password && cx("error")}
                    />
                    {errors.password && touched.password && (
                      <div className={cx("input-feedback")}>{errors.password}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <Button 
                      primary
                      className="login-button"
                      disabled={isSubmitting}                
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  </div>                
                </Grid>                                                  
              </form>
          );
        }}
      </Formik>
    </Container>
  )
}

export default LoginPage;