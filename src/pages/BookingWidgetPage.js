import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { AppReducerContext } from "../contexts/AppReducerContext";
import { Table, TableItem } from "../components/tables/tables";

const BookingWidgetPage = () => {

  const { state } = useContext(AppReducerContext)

  return (
    <div>
      <Table>
        <TableItem 
          label={"Widget ID"} 
          value={state.auth.user.outseta_id}
        />
        <TableItem 
          label={"Html"} 
          value={`<div id="calendar-widget" width="100%"></div>`}
        />        
        <TableItem 
          label={"Javascript"} 
          value={
            `<script id="calendar-module" src="./script.js" secret_key="${state.auth.user.outseta_id}"></script>`
          }
        />
      </Table>
    </div>
  )
}

export default BookingWidgetPage;