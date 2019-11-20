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
// import SpinnerContainer from "../../../layout/Spinner";

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
  const [showEditQuoteModal, setShowEditQuoteModal] = useState(null)

  const handleDelete = async (bookingId, quoteId) => {
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
      {
        showEditQuoteModal !== null && (
          <Modal
            isOpen={true}
            onClose={() => {
              setShowEditQuoteModal(null);
            }}
          >
            <EditQuote
              booking={booking}              
              quoteId={showEditQuoteModal}
              onEndEditing={() => {setShowEditQuoteModal(null)}}
            />
          </Modal>
        )
      }      
      <div
        className={css`
          height: 100%;
        `}
      >
        {/*<SpinnerContainer loading={state.bookings.loadingQuotes.toString()} />*/}

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
                          setShowEditQuoteModal(quote.id)
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
            setShowEditQuoteModal(-1)
          }}
        >
          New Quote
        </OutlinedButton>
      </div>
    </>
  );
};

export default QuotesSection;
