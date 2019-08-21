import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Table, TableValue } from "../../../tables/tables";
import { formatEventDate } from "../../../../utils/dateFormatting";
import { formatCurrency } from "../../../../utils/numbers";
import OutlinedButton from "../../../buttons/OutlinedButton";
import addGlyph from "../../../../images/Glyphs/add.svg";
import { AppReducerContext } from "../../../../contexts/AppReducerContext";
import DropdownMenu from "../../../buttons/DropdownMenu";
import colors from "../../../style/colors";
import { css } from "emotion";
import Modal from "../../../modals/modal";
import EditQuote from "./editQuote";
import SpinnerContainer from "../../../layout/Spinner";

import { 
  REQUEST_GET_BOOKING_QUOTE,
  GET_BOOKING_QUOTE_SUCCESS,
  GET_BOOKING_QUOTE_ERROR,
  REQUEST_CREATE_BOOKING_QUOTE,
  GET_CREATE_BOOKING_QUOTE_SUCCESS,
  GET_CREATE_BOOKING_QUOTE_ERROR,
  REQUEST_UPDATE_BOOKING_QUOTE,
  UPDATE_BOOKING_QUOTE_SUCCESS,
  UPDATE_BOOKING_QUOTE_ERROR,
  REQUEST_DELETE_BOOKING_QUOTE,
  DELETE_BOOKING_QUOTE_SUCCESS,
  DELETE_BOOKING_QUOTE_ERROR,
} from "../../../../reducers/actionType";

const QuotesSection = props => {
  const { booking, onQuoteConverted } = props;
  const { state, dispatch } = useContext(AppReducerContext);
  const [quoteBeingEditedIndex, setQuoteBeingEditedIndex] = useState(
    null
    // 0
  );
  const [quoteBeingEditedIsNew, setQuoteBeingEditedIsNew] = useState(
    false
    // true
  );
    
  useEffect(() => {
    const getQuote = async () => {

      try {
        dispatch({ type: REQUEST_GET_BOOKING_QUOTE })

        const res = await axios.get(`/bookings/${booking.id}/quotes`);

        dispatch({
          type: GET_BOOKING_QUOTE_SUCCESS,
          payload: res.data.quotes,
        })
      } catch (err) {
        dispatch({ GET_BOOKING_QUOTE_ERROR })
      }      
    }
    getQuote();
  }, [])

  const handleSave = async (shouldSave) => {

    dispatch({
      type: "quote_update_total",
      booking: booking.id,
      quote: quoteBeingEditedIndex
    });

    if (!shouldSave && quoteBeingEditedIsNew) {
      dispatch({
        type: "delete_quote",
        booking: booking.id,
        index: quoteBeingEditedIndex
      });
    }

    if (!shouldSave && !quoteBeingEditedIsNew) {
      dispatch({
        type: "restore_quote_backup",
        booking: booking.id,
        index: quoteBeingEditedIndex
      });
    }

    if (shouldSave) {
      if (quoteBeingEditedIsNew) {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
    
          const saveOne = {...state.bookings.quotes[quoteBeingEditedIndex]};
    
          dispatch({ type: REQUEST_CREATE_BOOKING_QUOTE })
  
          const res = await axios.post(
            `/bookings/${booking.id}/quotes`,
            {
              slots: JSON.stringify(saveOne.slots),
              costItems: JSON.stringify(saveOne.costItems),
              value: saveOne.value,
              discount: saveOne.discount,
              createdAt: saveOne.createdAtAt,
              note: saveOne.note
            },
            config
          )
    
          dispatch({ 
            type: GET_CREATE_BOOKING_QUOTE_SUCCESS,
            payload: res.data.quote
          })
          
        } catch (err) {
          dispatch({ type: GET_CREATE_BOOKING_QUOTE_ERROR });
        }
      } else {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
    
          const saveOne = {...state.bookings.quotes[quoteBeingEditedIndex]};
    
          dispatch({ type: REQUEST_UPDATE_BOOKING_QUOTE })

          const res = await axios.put(
            `/bookings/${booking.id}/quotes`,
            {
              slots: JSON.stringify(saveOne.slots),
              costItems: JSON.stringify(saveOne.costItems),
              value: saveOne.value,
              discount: saveOne.discount,
              createdAt: saveOne.createdAt,
              note: saveOne.note
            },
            config
          )
    
          dispatch({ 
            type: UPDATE_BOOKING_QUOTE_SUCCESS,
            payload: res.data.quote
          })
          
        } catch (err) {
          dispatch({ type: UPDATE_BOOKING_QUOTE_ERROR });
        }
      }
    }

    setQuoteBeingEditedIndex(null);
    setQuoteBeingEditedIsNew(false);
  }

  const handleDelete = async (bookingId, quoteId) => {
    debugger;
    try {
      dispatch({ type: REQUEST_DELETE_BOOKING_QUOTE });

      const res = await axios.delete(`/bookings/${bookingId}/quotes/${quoteId}`);

      dispatch({ 
        type: DELETE_BOOKING_QUOTE_SUCCESS,
        payload: quoteId,
      })
    } catch (err) {
      dispatch({ type: DELETE_BOOKING_QUOTE_ERROR })
    }  
  }

  return (
    <>
      <Modal
        isOpen={quoteBeingEditedIndex !== null}
        onClose={() => {
          setQuoteBeingEditedIsNew(false);
          setQuoteBeingEditedIndex(null);
        }}
      >
        <EditQuote
          booking={booking}
          quote={state.bookings.quotes[quoteBeingEditedIndex]}
          index={quoteBeingEditedIndex}
          onEndEditing={shouldSave => {handleSave(shouldSave)}}
        />
      </Modal>
      <div
        className={css`
          height: 100%;
        `}
      >
        <SpinnerContainer loading={state.bookings.loadingQuotes.toString()} />

        {state.bookings.quotes.length > 0 && (
          <Table
            columns="50px 120px 100px 120px"
            columnTitles={["ID", "createdAt", "Value", ""]}
          >
            {state.bookings.quotes.map((quote, index) => {
              return (
                <React.Fragment key={index}>
                  <TableValue>{index + 1}</TableValue>
                  <TableValue>{formatEventDate(quote.createdAt)}</TableValue>
                  <TableValue>
                    {formatCurrency(quote.value, state.bookings.currency)}
                  </TableValue>
                  <DropdownMenu
                    items={["Edit", "Export", "Convert to Invoice", "Delete"]}
                    colors={[colors.grey, colors.grey, colors.grey, "#D13636"]}
                    onItemSelected={item => {
                      switch (item) {
                        case "Delete":
                          return handleDelete(booking.id, quote.id);
                        case "Edit":
                          setQuoteBeingEditedIndex(index);
                          setQuoteBeingEditedIsNew(false);
                          dispatch({
                            type: "backup_quote",
                            booking: booking.id,
                            index
                          });
                          break;
                        case "Convert to Invoice":
                          onQuoteConverted && onQuoteConverted();
                          setTimeout(
                            () =>
                              dispatch({
                                type: "convert_quote_to_invoice",
                                booking: booking.id,
                                quote: index
                              }),
                            300
                          );
                          break;
                        case "Export":
                          break;
                        default:
                          throw new Error();
                      }
                    }}
                  />
                </React.Fragment>
              );
            })}
          </Table>
        )}
        <br />
        <OutlinedButton
          primary
          icon={addGlyph}
          onClick={() => {
            const quotesCount = (state.bookings.quotes && state.bookings.quotes.length) || 0;
            dispatch({ type: "create_quote", booking: booking.id });
            setQuoteBeingEditedIndex(quotesCount);
            setQuoteBeingEditedIsNew(true);
          }}
        >
          New Quote
        </OutlinedButton>
      </div>
    </>
  );
};

export default QuotesSection;
