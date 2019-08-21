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
} from "../reducers/actionType";

let quoteBackup = null;

function bookingsReducer(state, action) {
  switch (action.type) {
    case REQUEST_GET_BOOKINGS:
      return {
        ...state,
        loadBooking: true,
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
      return {
        ...state,
        loadBookingAction: false,
        bookings: [ ...state.bookings, action.payload ]        
      }
    case GET_ADD_BOOKING_ERROR:
      return {
        ...state,
        loadBookingAction: false,
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
        bookings: state.bookings.filter(item => item.id === action.payload)
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
        loadBooking: false,
        bookingStatus: [ ...action.payload ]
      }
    case GET_BOOKING_BOOKINGSATTUS_ERROR:
      return {
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
        defaultVatRate: action.payload.vatRate,
        currency: action.payload.currency.toUpperCase(),
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
        quote: [...action.payload]
      }
    case GET_BOOKINGS_ERROR:
      return {
        ...state,
        loadingQuotes: false,
      }
    case "create_quote": {
      const booking = state.bookings.find(booking => booking.id === action.booking);
      const newQuotes = [ ...state.quotes];
      if (state.quotes) {
        newQuotes.push(createEmptyQuote(booking));
      } else {
        newQuotes = [createEmptyQuote(booking)];
      }
      return {
        ...state,
        quotes: newQuotes
      }
    }
    case "backup_quote": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.index];
      // quoteBackup = { ...quote };
      // return newState;
      quoteBackup = { ...state.quotes[action.quote] };
      return {
        ...state,        
      }
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
    case "restore_quote_backup": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // booking.quotes[action.index] = quoteBackup;
      // quoteBackup = null;
      // return newState;
      const newOne = { ...quoteBackup };
      quoteBackup = null;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.index){            
            return newOne;
          }
          return item;
        })
      }
    }

    case "delete_quote": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // booking.quotes.splice(action.index, 1);
      // return newState;
      return {
        ...state,
        quotes: state.quotes.filter((item, nIndex) => nIndex !== action.index)
      }
    }
    case "set_quote_value": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.index];
      // quote[action.key] = action.value;
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.nIndex)
            item[action.key] = action.value;
          return item;
        })
      }
    }

    case "quote_update_slot": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // const slot = quote.slots[action.index];
      // slot[action.key] = action.value;
      // return newState;      
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.slots[action.index][action.key] = action.value
          }
          return item;        
        })
      }
    }
    case "quote_update_multiday_slot_start": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // const slot = quote.slots[action.index];
      // slot.dateRange[0] = action.value;
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.slots[action.index].dateRange[0] = action.value;
          }
          return item;
        })
      }
    }
    case "quote_update_multiday_slot_end": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // const slot = quote.slots[action.index];
      // slot.dateRange[1] = action.value;
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.slots[action.index].dateRange[1] = action.value;
          }
          return item;
        })
      }
    }
    case "quote_update_slot_start_time": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // const slot = quote.slots[action.index];
      // slot.startHour = action.date.getHours();
      // slot.startMinute = action.date.getMinutes();
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.slots[action.index].startHour = action.date.getHours();
            item.slots[action.index].startMinute = action.date.getMinutes();
          }
          return item;
        })
      }
    }
    case "quote_update_slot_end_time": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // const slot = quote.slots[action.index];
      // slot.endHour = action.date.getHours();
      // slot.endMinute = action.date.getMinutes();
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.slots[action.index].endHour = action.date.getHours();
            item.slots[action.index].endMinute = action.date.getMinutes();
          }
          return item;
        })
      }
    }

    case "quote_append_slot":
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // quote.slots.push({
      //   kind: "single-day",
      //   date: action.date || new Date(),
      //   startHour: (action.startDate && action.startDate.getHours()) || 9,
      //   startMinute: (action.startDate && action.startDate.getMinutes()) || 0,
      //   endHour: (action.endDate && action.endDate.getHours()) || 18,
      //   endMinute: (action.endDate && action.endDate.getMinutes()) || 0
      // });
      // return newState;            
      return {
        ...state,        
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.slots.push({
              kind: "single-day",
              date: action.date || new Date(),
              startHour: (action.startDate && action.startDate.getHours()) || 9,
              startMinute: (action.startDate && action.startDate.getMinutes()) || 0,
              endHour: (action.endDate && action.endDate.getHours()) || 18,
              endMinute: (action.endDate && action.endDate.getMinutes()) || 0
            })            
          }
          return item;            
        })
      }
    case "quote_append_slot_multi": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // quote.slots.push({
      //   kind: "multi-day",
      //   dateRange: [new Date(), addDays(new Date(), 1)],
      //   startHour: 9,
      //   startMinute: 0,
      //   endHour: 18,
      //   endMinute: 0
      // });
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if(nIndex === action.quote) {
            item.slots.push({
              kind: "multi-day",
              dateRange: [new Date(), addDays(new Date(), 1)],
              startHour: 9,
              startMinute: 0,
              endHour: 18,
              endMinute: 0
            })
          }
          return item;
        })
      }
    }

    case "quote_remove_slot": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // quote.slots.splice(action.index, 1);
      // return newState;
      return {
        ...state,
        quotes: state.quotes.filter((item, nIndex) => nIndex !== action.quote)
      }
    }

    case "quote_update_total": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];

      // if (!quote) {
      //   return state;
      // }

      // const grandTotal = computeCostItemsSummary(
      //   quote.costItems,
      //   quote.discount
      // )[2];

      // quote.value = grandTotal;

      // return newState;
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

    case "quote_update_discount": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];

      // if (action.value && action.value.length) {
      //   try {
      //     quote.discount = parseInt(action.value);
      //   } catch (err) {
      //     quote.discount = 0;
      //   }
      // } else {
      //   quote.discount = 0;
      // }

      // quote.discountText = action.value;
      // return newState;

      const newOne = [ ...state.quotes ];
      if (action.value && action.value.length) {
        try {
          newOne[action.quote].discount = parseInt(action.value);
        } catch (err) {
          newOne[action.quote].discount = 0
        }
      } else {
        newOne[action.quote].discount = 0;
      }
      newOne[action.quote].discountText = action.value;

      return {
        ...state,
        quotes: [...newOne]
      }
    }

    // COST ITEMS

    case "append_cost_item": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // quote.costItems.push(createEmptyCostItem({ vatRate: action.vatRate }));
      // return newState;
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote)
            item.costItems.push(createEmptyCostItem({ vatRate: action.vatRate }));
          return item;
        })
      }
    }

    case "remove_cost_item": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // quote.costItems.splice(action.index, 1);
      // return newState;

      const newCostItems = state.quotes[action.quote].costItems.filter((item, nIndex) => nIndex !== action.index);      

      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.costItems = [ ...newCostItems ];
          }
          return item;
        })
      }
    }

    case "update_cost_item": {
      // const newState = Array.from(state);
      // const booking = newState.find(booking => booking.id === action.booking);
      // const quote = booking.quotes[action.quote];
      // const constItem = quote.costItems[action.index];
      // constItem[action.key] = action.value;
      // return newState;      
      return {
        ...state,
        quotes: state.quotes.map((item, nIndex) => {
          if (nIndex === action.quote) {
            item.costItems[action.index][action.key] = action.value;
          }
          return item;
        })
      }
    }

    // INVOICES

    case "update_invoice_status": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const invoice = booking.invoices[action.index];
      invoice.status = action.status;
      return newState;
    }

    case "delete_invoice": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      booking.invoices.splice(action.invoice);
      return newState;
    }

    // INVOICES

    case "update_invoice": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      booking.invoices[action.index] = action.invoice;
      return newState;
    }

    case "append_invoice": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      booking.invoices.push(action.invoice);
      return newState;
    }

    default: {
      return state;
    }
  }
}

export default bookingsReducer;
