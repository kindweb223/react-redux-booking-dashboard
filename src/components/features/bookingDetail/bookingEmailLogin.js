import React, {useState, useContext, useEffect} from "react"
import axios from 'axios'
import { css } from "emotion";
import styled from "styled-components"
import H3 from "../../typography/H3"
import InputField from "../../buttons/InputField"
import { ModalContainer, ModalTopSection, ModalTitleAndButtons, ModalBottomSection } from "../../modals/containers"
import { TableLabel, TableDivider, TableEditableValue } from "../../tables/tables"
import Button from '../../buttons/Button'
import { getSubDomain } from "../../../constants";
import { AppReducerContext } from "../../../contexts/AppReducerContext";

const Row = styled.div`
  display: flex;  
  width: 100%;
`
const BookingEmailLogin = () => {

  const { state, dispatch } = useContext(AppReducerContext);
  const [userEmail, setUserEmail] = useState({value: '', validate: true, errMsg: ''})
  
  useEffect(() => {
    setUserEmail({value: '', validate: true, errMsg: ''});
  }, [])

  const onUserEmailChange = value => {
    if (value.length > 0)
      setUserEmail({
        value,
        validate: true,
        errMsg: ''      
      })
    else 
      setUserEmail({
        value,
        validate: false,
        errMsg: 'Email is required.'      
      })    
  }

  const onNext = () => {
    if (userEmail.value.length === 0) {
      setUserEmail({
        ...userEmail, validate: false, errMsg: 'Email is required.'
      })
      return
    }

    if (!userEmail.validate)
      return;

    axios.post(
      '/users/loginWithEmailSubdomain', 
      {email: userEmail.value, subdomain: getSubDomain()}
    ).then(res => {
      if (res.data.success) {
        dispatch({
          type: 'get_login_success',
          payload: {...res.data},
        })
      } else {
        setUserEmail({...userEmail, validate: false, errMsg: res.data.error})
      }
    }).catch(error => {
      setUserEmail({...userEmail, validate: false, errMsg: error.response.data.error})
    });              
  }

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3>New Booking</H3>
        </ModalTitleAndButtons>
      </ModalTopSection>
      <ModalBottomSection>
        <H3>To start, please enter your email address.</H3>
        <TableLabel>You'll be the holder of this new booking</TableLabel>
        <TableDivider />
        <Row>
          <TableEditableValue 
            labe={'Email'}
            value={userEmail.value}
            style={{flex: 1}}
            onChange={value => onUserEmailChange(value)}
            className={!userEmail.validate ? "error" : ""}
          />
          <Button 
            primary 
            style={{marginLeft: '1em', minWidth: '80px'}} 
            onClick={onNext}
            disabled={!userEmail.validate}
          >
            Next
          </Button>
        </Row>
        <Row>
          {
            !userEmail.validate && 
            <p 
              className={
                css`
                  color: #E92579;            
                  margin: 0.2em 0 0 0;
                  padding: 0 0.6em;
                  font-size: 0.8em;
                `
              }
            >
              {userEmail.errMsg}
            </p>
          }     
        </Row>
      </ModalBottomSection>
    </ModalContainer>
  )
}

export default BookingEmailLogin