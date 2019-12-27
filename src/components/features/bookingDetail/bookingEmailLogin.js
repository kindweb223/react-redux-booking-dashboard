import React, {useState, useContext, useEffect} from "react"
import axios from 'axios'
import styled from "styled-components"
import H3 from "../../typography/H3"
import InputField from "../../buttons/InputField"
import { ModalContainer, ModalTopSection, ModalTitleAndButtons, ModalBottomSection } from "../../modals/containers"
import { TableLabel, TableDivider } from "../../tables/tables"
import Button from '../../buttons/Button'

const Row = styled.div`
  display: flex;  
  width: 100%;
`
const BookingEmailLogin = () => {

  const [userEmail, setUserEmail] = useState('')
  useEffect(() => {
    setUserEmail('');
  }, [])

  const onUserEmailChange = value => {
    setUserEmail(value)
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
        <Row><TableLabel>Email</TableLabel></Row>
        <Row>
          <InputField 
            value={userEmail}
            style={{flex: 1}}
            onChange={event => onUserEmailChange(event.target.value)}
          />
          <Button primary style={{marginLeft: '1em', minWidth: '80px'}}>
            Next
          </Button>
        </Row>
      </ModalBottomSection>
    </ModalContainer>
  )
}

export default BookingEmailLogin