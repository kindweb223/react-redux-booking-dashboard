import {
  createEmptyQuote,
  createEmptyCostItem,
  convertQuoteToInvoice
} from "../models/bookings";
import { addDays } from "date-fns/esm";
import { computeCostItemsSummary } from "../utils/costItemsMath";

import {
  REQUSET_ADD_BOOKING,
  GET_ADD_BOOKING_SUCCESS,
  GET_ADD_BOOKING_ERROR,
  REQUEST_UPDATE_BOOKING,
  GET_UPDATE_BOOKING_SUCCESS,
  GET_UPDATE_BOOKIG_ERROR,
  REQUEST_GET_BOOKINGS,
  GET_BOOKINGS_SUCCESS,
  GET_BOOKINGS_ERROR,
  REQUEST_DELETE_BOOKING,
  GET_DELETE_BOOKING_SUCCESS,
  GET_DELETE_BOOKING_ERROR,
  REQUEST_GET_BOOKING_BOOKINGSTATUS,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS,
  GET_BOOKING_BOOKINGSATTUS_ERROR,
  REQUEST_GET_BOOKING_QUOTE,
  GET_BOOKING_QUOTE_SUCCESS,
  GET_BOOKING_QUOTE_ERROR,
  REUQEST_GET_BOOKING_SETTINGS,
  GET_BOOKING_SETTINGS_SUCCESS,
  GET_BOOKING_SETTINGS_ERROR,
  REQUEST_CREATE_BOOKING_QUOTE,
  GET_CREATE_BOOKING_QUOTE_SUCCESS,
  GET_CREATE_BOOKING_QUOTE_ERROR,
  REQUEST_UPDATE_BOOKING_QUOTE,
  UPDATE_BOOKING_QUOTE_SUCCESS,
  UPDATE_BOOKING_QUOTE_ERROR,
  REQUEST_DELETE_BOOKING_QUOTE,
  DELETE_BOOKING_QUOTE_SUCCESS,
  DELETE_BOOKING_QUOTE_ERROR,
  REQUEST_CREATE_BOOKING_INVOICE,
  GET_CREATE_BOOKING_INVOICE_SUCCESS,
  GET_CREATE_BOOKING_INVOICE_ERROR,
  REQUEST_UPDATE_BOOKING_INVOICE,
  UPDATE_BOOKING_INVOICE_SUCCESS,
  UPDATE_BOOKING_INVOICE_ERROR,
  REQUEST_DELETE_BOOKING_INVOICE,
  DELETE_BOOKING_INVOICE_SUCCESS,
  DELETE_BOOKING_INVOICE_ERROR,
  GET_BOOKING_INVOICE_ERROR,
  REQUEST_GET_BOOKING_INVOICE,
  GET_BOOKING_INVOICE_SUCCESS,
  CLEAR_BOOKING_DATA,
} from "../reducers/actionType";

let quoteBackup = null;

function bookingsReducer(state, action) {
  switch (action.type) {
    case REQUEST_GET_BOOKINGS:
      return {
        ...state,
        loadBooking: true,
      }
    case CLEAR_BOOKING_DATA:
      return {
        ...state,
        quotes: "",
        invoices: "",
      }
    case GET_BOOKINGS_SUCCESS:
      const newBookings = action.payload.map(item => {
        if(item.slots)
          item.slots = JSON.parse(item.slots);
        return item;
      })
      return {
        ...state,
        loadBooking: false,
        bookings: [ ...newBookings ]
      }
    case GET_BOOKINGS_ERROR:
      return {
        ...state,
        loadBooking: false,
      }
    case REQUSET_ADD_BOOKING:
      return {
        ...state,
        loadBookingAction: true,
      }
    case GET_ADD_BOOKING_SUCCESS:
      const newBookingss = action.payload;
      if(newBookingss.slots)
        newBookingss.slots = JSON.parse(newBookingss.slots);
      return {
        ...state,
        loadBookingAction: false,
        bookings: [ ...state.bookings, newBookingss ]
      }
    case GET_ADD_BOOKING_ERROR:
      return {
        ...state,
        loadBookingAction: false,
        bookings: [],
      }
    case REQUEST_UPDATE_BOOKING:
      return {
        ...state,
        loadBookingAction: true,
      }
    case GET_UPDATE_BOOKING_SUCCESS:
      return {
        ...state,
        loadBookingAction: false,
        bookings: state.bookings.map(item => {
          if (item.id === action.payload.id) {
            return {...action.payload, slots: JSON.parse(action.payload.slots)};
          }
          else return item;
        })
      }
    case GET_UPDATE_BOOKIG_ERROR:
      return {
        ...state,
        loadBookingAction: false,
      }
    case REQUEST_DELETE_BOOKING:
      return {
        ...state,
        loadBookingAction: true,
      }
    case GET_DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        loadBookingAction: false,
        bookings: state.bookings.filter(item => item.id !== action.payload)
      }
    case GET_DELETE_BOOKING_ERROR:
      return {
        ...state,
        loadBookingAction: false,
      }
    case REQUEST_GET_BOOKING_BOOKINGSTATUS:
      return {
        ...state,
        loadBooking: true,
      }
    case GET_BOOKING_BOOKINGSTATUS_SUCCESS:
      return {
        ...state,
        // loadBooking: false,
        bookingStatus: [ ...action.payload ]
      }
    case GET_BOOKING_BOOKINGSATTUS_ERROR:
      return {
        ...state,
        loadBooking: false,
      }
    case "upsert_booking": {
      const newState = Array.from(state);

      const existingBookingIndex = state.findIndex(
        booking => booking.id === action.booking.id
      );

      if (existingBookingIndex !== -1) {
        // update
        newState[existingBookingIndex] = action.booking;
      } else {
        // insert
        newState.push(action.booking);
      }

      return newState;
    }
    case "update_booking_status": {
      const newState = Array.from(state);

      const bookingIndex = state.findIndex(booking => booking.id === action.id);
      newState[bookingIndex].status = action.status;

      return newState;
    }
    case "delete_booking": {
      const newState = Array.from(state);
      newState.splice(action.index, 1);
      return newState;
    }

    // QUOTES
    case REUQEST_GET_BOOKING_SETTINGS:
      return {
        ...state,
        loadBooking: true,
      }
    case GET_BOOKING_SETTINGS_SUCCESS:
      return {
        ...state,
        defaultVatRate: (action.payload && action.payload.vatRate)? action.payload.vatRate : 0,
        currency: (action.payload && action.payload.currency) ? action.payload.currency.toUpperCase() : "",
        loadBooking: false,
      }
    case GET_BOOKING_SETTINGS_ERROR:
      return {
        ...state,
        loadBooking: false,
      }
    case REQUEST_GET_BOOKING_QUOTE:
      return {
        ...state,
        loadingQuotes: true,
      }
    case GET_BOOKING_QUOTE_SUCCESS:
      return {
        ...state,
        loadingQuotes: false,
        quotes: action.payload.map(item => {
          item.slots = JSON.parse(item.slots);
          item.costItems = JSON.parse(item.costItems);
          return item;
        })
      }
    case GET_BOOKING_QUOTE_ERROR:
      return {
        ...state,
        loadingQuotes: false,
      }
    case REQUEST_CREATE_BOOKING_QUOTE:
      return {
        ...state,
        loadingQuotes: true,
      }
    case GET_CREATE_BOOKING_QUOTE_SUCCESS:
      return {
        ...state,
        loadingQuotes: false,
        quotes: [
          ...state.quotes,
          {
            ...action.payload,
            slots: JSON.parse(action.payload.slots),
            costItems: JSON.parse(action.payload.costItems),
          }
        ]        
      }
    case GET_CREATE_BOOKING_QUOTE_ERROR:
      return {
        ...state,
        loadingQuotes: false,
      }
    case REQUEST_UPDATE_BOOKING_QUOTE:
      return {
        ...state,
        loadingQuotes: true,
      }
    case UPDATE_BOOKING_QUOTE_SUCCESS:
      return {
        ...state,
        loadingQuotes: false,
        quotes: [
          ...state.quotes.map(item => {
            if (item.id === action.payload.id) {
              return {
                ...action.payload,
                slots: JSON.parse(action.payload.slots),
                costItems: JSON.parse(action.payload.costItems),
              }
            }
            return item;
          })
        ]
      }
    case UPDATE_BOOKING_QUOTE_ERROR:
      return {
        ...state,
        loadingQuotes: false,
      }
    case REQUEST_DELETE_BOOKING_QUOTE:
      return {
        ...state,
        loadingQuotes: true,
      }
    case DELETE_BOOKING_QUOTE_SUCCESS:
      return {
        ...state,
        quotes: state.quotes.filter(item => item.id !== action.payload),
        loadingQuotes: false,
      }
    case DELETE_BOOKING_QUOTE_ERROR:
      return {
        ...state,
        loadingQuotes: false,
      }
    case "convert_quote_to_invoice": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const invoiceNumber =
        state.reduce((acc, booking) => acc + booking.invoices.length, 0) + 1;
      const invoice = convertQuoteToInvoice(quote, invoiceNumber, booking);
      booking.invoices.push(invoice);

      return newState;
    }

    case "quote_update_total": {
      const quote = state.quotes[action.quote];
      if (!quote)
        return {
          ...state,
        }
      else {
        return {
          ...state,
          quotes: state.quotes.map((item, nIndex) => {
            if (nIndex === action.quote) {
              item.value = computeCostItemsSummary( item.costItems, item.discount )[2];
            }
            return item;
          })
        }
      }
    }

    // INVOICES

    case "update_invoice_status": {
      return {
        ...state,
        invoices: state.invoices.map((item, nIndex) => {
          if (nIndex === action.index) {
            item.status = action.status;
          }
          return item;
        })
      }
    }

    case "delete_invoice": {
      return {
        ...state,
        invoices: state.invoices.filter((item, nIndex) => nIndex !== action.index)
      }
    }

    // INVOICES

    case "update_invoice": {
      const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // booking.invoices[action.index] = action.invoice;
      return newState;
    }

    case "append_invoice": {
      let newInvoice = state.invoices;
      newInvoice.push(action.invoice);
      return {
        ...state,
        invoices: newInvoice
      };
    }

    case REQUEST_GET_BOOKING_INVOICE:
      return {
        ...state,
        loadingInvoice: true,
      }
    case GET_BOOKING_INVOICE_SUCCESS:
      return {
        ...state,
        loadingInvoice: false,
        invoices: action.payload.map(item => {
          item.slots = item.slots && JSON.parse(item.slots);
          item.costItems = item.cost_items && JSON.parse(item.cost_items);
          return item;
        })
      }
    case GET_BOOKING_INVOICE_ERROR:
      return {
        ...state,
        loadingInvoice: false,
      }
    case REQUEST_CREATE_BOOKING_INVOICE:
      return {
        ...state,
        loadingInvoice: true,
      }
    case GET_CREATE_BOOKING_INVOICE_SUCCESS:
      const invoices = state.invoices;
      const newInvoice = action.payload;

      newInvoice.BookingId = parseInt(newInvoice.BookingId);
      newInvoice.slots = newInvoice.slots && JSON.parse(newInvoice.slots);
      newInvoice.costItems = newInvoice.cost_items && JSON.parse(newInvoice.cost_items);
      invoices.push(newInvoice)

      return {
        ...state,
        loadingInvoice: false,
        invoices: [ ...invoices ],
      };
    case GET_CREATE_BOOKING_INVOICE_ERROR:
      return {
        ...state,
        loadingInvoice: false,
      }
    case REQUEST_UPDATE_BOOKING_INVOICE:
      return {
        ...state,
        loadingInvoice: true,
      }
    case UPDATE_BOOKING_INVOICE_SUCCESS:  
      return {
        ...state,
        loadingInvoice: false,
        invoices: state.invoices.map(item => {
          if( item.id === action.payload.id ) {
            item = action.payload;
            item.slots = action.payload.slots ? JSON.parse(action.payload.slots) : [];
            item.costItems = action.payload.cost_items ? JSON.parse(action.payload.cost_items) : [];
          }
          return item;
        })
      }

    case UPDATE_BOOKING_INVOICE_ERROR:
      return {
        ...state,
        loadingInvoice: false,
      }
    case REQUEST_DELETE_BOOKING_INVOICE:
      return {
        ...state,
        loadingInvoice: true,
      }
    case DELETE_BOOKING_INVOICE_SUCCESS:
      return {
        ...state,
        invoices: state.invoices.filter(item => item.id !== action.payload),
        loadingInvoice: false,
      }
    case DELETE_BOOKING_INVOICE_ERROR:
      return {
        ...state,
        loadingInvoice: false,
      }

    default: {
      return state;
    }
  }
}

export default bookingsReducer;
