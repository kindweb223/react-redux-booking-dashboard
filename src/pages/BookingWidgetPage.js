import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCode, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { AppReducerContext } from "../contexts/AppReducerContext";
import { Table, TableItem, TableLabel, TableEditableValue } from "../components/tables/tables";
import InputField from "../components/buttons/InputField";

import colors from "../components/style/colors"
import Button from "../components/buttons/Button";

const Row = styled.div`
  position: relative;  
  display: flex;
  align-items: center;
`;

const HtmlDiv = styled.div`
  border-color: #E92579;
  background: #E92579;
  color: white;
  justify-content: center;
  font-size: 1em;
  text-align: center;
  border: 1px solid #E6E8E9;
  border-radius: 0.25em;
  height: 34px;
  padding: 0 0.7em;
  align-items: center;
  display: flex;
`;

const InstrunctionDiv = styled.div`
  margin-left: 1em;
`
const WidgetContent = styled.div`
  margin-top: 3em;
`

const BookingWidgetPage = () => {

  const { state } = useContext(AppReducerContext)
  
  return (
    <div>
      <Table>
        <Row>
          <HtmlDiv><FontAwesomeIcon className="fa-icons" icon={faCode} /></HtmlDiv>
          <InstrunctionDiv>
            <TableLabel color={colors.dark} style={{fontSize:'1em', margin: '0'}}>Setup Instructions</TableLabel>
            <TableLabel>Find instrunctions on how to setup your website booking widget.</TableLabel>
          </InstrunctionDiv>          
        </Row>
        <WidgetContent>
          <Row style={{marginBottom: '1em'}}>
            <TableLabel style={{minWidth: '100px'}}>Widget ID</TableLabel>
            <InputField value={state.auth.user.outseta_id} disabled style={{flex: 1}} />
            <CopyToClipboard text={state.auth.user.outseta_id}>
              <Button primary style={{marginLeft: '1em'}}>
                Copy
                <FontAwesomeIcon className="fa-icons" icon={faCopy} style={{marginLeft:'0.3em'}}/>
              </Button>
            </CopyToClipboard>
          </Row>
          <Row>
            <TableLabel style={{minWidth: '100px'}}>Widget</TableLabel>
            <Button primary>
              <FontAwesomeIcon className="fa-icons" icon={faExternalLinkAlt} style={{marginRight:'0.3em'}}/>
              Booking Widget Setup Instruction
            </Button>
          </Row>
        </WidgetContent>
        {/* <Row>
          <TableLabel>Html</TableLabel>
          <div className="widget-content">
            <TableItem           
              value={`<div id="calendar-widget" style="width: 100%; height: 100vh"></div>`}
            />        
            <CopyToClipboard text={`<div id="calendar-widget" style="width: 100%; height: 100vh"></div>`}>
              <FontAwesomeIcon className="fa-icons" icon={faCopy} />
            </CopyToClipboard>
          </div>
        </Row>
        <Row>
          <TableLabel>Javascript</TableLabel>
          <div className="widget-content multiline">
            <TableItem 
              value={
                `<script id="calendar-module"
                  src="https://calendarwidget.herokuapp.com/calendarwidget.js"
                  secret_key="${state.auth.user.outseta_id}">
                </script>`
              }
              style={{maxWidth: 'calc(100% - 40px)'}}
            />
            <CopyToClipboard text={`<script id="calendar-module" src="https://calendarwidget.herokuapp.com/calendarwidget.js" secret_key="${state.auth.user.outseta_id}"></script>`}>
              <FontAwesomeIcon className="fa-icons" icon={faCopy} />
            </CopyToClipboard>
          </div>
        </Row>                 */}
      </Table>
    </div>
  )
}

export default BookingWidgetPage;