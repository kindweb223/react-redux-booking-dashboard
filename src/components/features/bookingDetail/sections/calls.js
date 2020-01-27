import React, {useState, useContext, useEffect} from "react";
import axios from "axios";

import { TableEditableValue } from "../../../tables/Tables";
import Button from "../../../buttons/Button";
import { REQUEST_UPDATE_BOOKING, GET_UPDATE_BOOKING_SUCCESS, GET_UPDATE_BOOKIG_ERROR } from "../../../../reducers/actionType";
import { AppReducerContext } from "../../../../contexts/AppReducerContext";

const CallsSection = props => {
  const { booking } = props;
  const [editing, setEditing] = useState(false);
  const [calls, setCalls] = useState(booking.calls);
  const { dispatch } = useContext(AppReducerContext);
  
  useEffect(() => {
    setCalls(booking.calls);
  }, [booking.calls])
  
  const handleUpdateBooking = async (updateBooking) => {
    if (!updateBooking) return;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      dispatch({ type: REQUEST_UPDATE_BOOKING })

      const res = await axios.put(
        `/bookings/${booking.id}`,
        {          
          calls
        },
        config
      );

      dispatch({
        type: GET_UPDATE_BOOKING_SUCCESS,
        payload: res.data.booking
      })
    } catch (err) {
      dispatch({ type: GET_UPDATE_BOOKIG_ERROR});
    }

    setEditing(false);
  }

  return (
    <>      
      {!editing ? (
        <>
          <div style={{whiteSpace: "pre-wrap"}}>{calls}</div>
          <Button 
            primary 
            onClick={() => setEditing(true)}
          >Edit</Button>
        </>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <TableEditableValue
            value={calls}
            longText
            longTextHeight="100%"
            height="100%"
            style={{
              flexBasis: '100%',
            }}
            onChange={value => setCalls(value)}                
          />
          <Button 
            primary 
            onClick={() => handleUpdateBooking(booking)}
            style={{
              marginLeft: 'auto',
              marginTop: "0.8em"
            }}
          >Save</Button>
        </div>
      )}      
    </>
  );
};

export default CallsSection;
