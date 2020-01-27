import React, {useState, useContext, useEffect} from "react";
import axios from "axios";

import { TableEditableValue } from "../../../tables/Tables";
import Button from "../../../buttons/Button";
import { REQUEST_UPDATE_BOOKING, GET_UPDATE_BOOKING_SUCCESS, GET_UPDATE_BOOKIG_ERROR } from "../../../../reducers/actionType";
import { AppReducerContext } from "../../../../contexts/AppReducerContext";

const NotesSection = props => {
  const { booking } = props;
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(booking.note);
  const { dispatch } = useContext(AppReducerContext);
  
  useEffect(() => {
    setNote(booking.note);
  }, [booking.note])
  
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
          note: note
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
          <div style={{whiteSpace: "pre-wrap"}}>{note}</div>
          <Button 
            primary 
            onClick={() => setEditing(true)}
          >Edit</Button>
        </>
      ) : (
        <>
          <div style={{width: "100%"}}>
            <TableEditableValue
              value={note}
              longText
              longTextHeight="500px"
              height="500px"
              style={{
                width: "100%",
                marginTop: "0.8em"            
              }}
              onChange={note => setNote(note)}                
            />
          </div>
          <Button 
            primary 
            onClick={() => handleUpdateBooking(booking)}
            style={{
              float: "right",
              marginTop: "0.8em"
            }}
          >Save</Button>
        </>
      )}      
    </>
  );
};

export default NotesSection;
