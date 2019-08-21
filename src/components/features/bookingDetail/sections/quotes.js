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

import { 
  REQUEST_GET_BOOKING_QUOTE,
  GET_BOOKING_QUOTE_SUCCESS,
  GET_BOOKING_QUOTE_ERROR,
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

  const handleSave = (shouldSave) => {
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

    setQuoteBeingEditedIndex(null);
    setQuoteBeingEditedIsNew(false);
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
        {state.bookings.quotes.length > 0 && (
          <Table
            columns="50px 120px 100px 120px"
            columnTitles={["ID", "Created", "Value", ""]}
          >
            {state.bookings.quotes.map((quote, index) => {
              return (
                <React.Fragment key={index}>
                  <TableValue>{index + 1}</TableValue>
                  <TableValue>{formatEventDate(quote.created)}</TableValue>
                  <TableValue>
                    {formatCurrency(quote.value, state.settings.currency)}
                  </TableValue>
                  <DropdownMenu
                    items={["Edit", "Export", "Convert to Invoice", "Delete"]}
                    colors={[colors.grey, colors.grey, colors.grey, "#D13636"]}
                    onItemSelected={item => {
                      switch (item) {
                        case "Delete":
                          return dispatch({
                            type: "delete_quote",
                            booking: booking.id,
                            index
                          });
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
