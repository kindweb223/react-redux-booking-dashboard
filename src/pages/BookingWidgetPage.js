import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { AppReducerContext } from "../contexts/AppReducerContext";
import { Table, TableItem, TableLabel } from "../components/tables/tables";

const Row = styled.div`
  position: relative;  
  .widget-content {
    display: flex;
    align-items: center;
    .fa-icons {
      margin-left: 1em;
      cursor: pointer;
    }
  }
`;
const BookingWidgetPage = () => {

  const { state } = useContext(AppReducerContext)

  const clickClipBoard = (clipStr) => {
    // document.execCommand(clipStr);
    clipStr.createTextRange().execCommand('copy');
  }
  
  return (
    <div>
      <Table>
        <Row>
          <TableLabel>Widget ID</TableLabel>          
          <div className="widget-content">
            <TableItem             
              value={state.auth.user.outseta_id}
            />
            <CopyToClipboard text={state.auth.user.outseta_id}>
              <FontAwesomeIcon className="fa-icons" icon={faCopy} />
            </CopyToClipboard>
          </div>
        </Row>        
        <Row>
          <TableLabel>Html</TableLabel>
          <div className="widget-content">
            <TableItem           
              value={`<div id="calendar-widget" width="100%"></div>`}
            />        
            <CopyToClipboard text={`<div id="calendar-widget" width="100%"></div>`}>
              <FontAwesomeIcon className="fa-icons" icon={faCopy} />
            </CopyToClipboard>
          </div>
        </Row>
        <Row>
          <TableLabel>Javascript</TableLabel>
          <div className="widget-content">
            <TableItem 
              value={
                `<script id="calendar-module" src="./script.js" secret_key="${state.auth.user.outseta_id}"></script>`
              }
            />
            <CopyToClipboard text={`<script id="calendar-module" src="./script.js" secret_key="${state.auth.user.outseta_id}"></script>`}>
              <FontAwesomeIcon className="fa-icons" icon={faCopy} />
            </CopyToClipboard>
          </div>
        </Row>                
      </Table>
    </div>
  )
}

export default BookingWidgetPage;