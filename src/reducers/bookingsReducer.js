import {
  createEmptyQuote,
  createEmptyCostItem,
  convertQuoteToInvoice
} from "../models/bookings";
import { addDays } from "date-fns/esm";
import { computeCostItemsSummary } from "../utils/costItemsMath";

let quoteBackup = null;

function bookingsReducer(state, action) {
  switch (action.type) {
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
    case "create_quote": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      if (booking.quotes) {
        booking.quotes.push(createEmptyQuote(booking));
      } else {
        booking.quotes = [createEmptyQuote(booking)];
      }
      return newState;
    }
    case "backup_quote": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.index];
      quoteBackup = { ...quote };
      return newState;
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
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      booking.quotes[action.index] = quoteBackup;
      quoteBackup = null;
      return newState;
    }

    case "delete_quote": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      booking.quotes.splice(action.index, 1);
      return newState;
    }
    case "set_quote_value": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.index];
      quote[action.key] = action.value;
      return newState;
    }

    case "quote_update_slot": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const slot = quote.slots[action.index];
      slot[action.key] = action.value;
      return newState;
    }
    case "quote_update_multiday_slot_start": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const slot = quote.slots[action.index];
      slot.dateRange[0] = action.value;
      return newState;
    }
    case "quote_update_multiday_slot_end": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const slot = quote.slots[action.index];
      slot.dateRange[1] = action.value;
      return newState;
    }
    case "quote_update_slot_start_time": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const slot = quote.slots[action.index];
      slot.startHour = action.date.getHours();
      slot.startMinute = action.date.getMinutes();
      return newState;
    }
    case "quote_update_slot_end_time": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const slot = quote.slots[action.index];
      slot.endHour = action.date.getHours();
      slot.endMinute = action.date.getMinutes();
      return newState;
    }

    case "quote_append_slot":
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      quote.slots.push({
        kind: "single-day",
        date: action.date || new Date(),
        startHour: (action.startDate && action.startDate.getHours()) || 9,
        startMinute: (action.startDate && action.startDate.getMinutes()) || 0,
        endHour: (action.endDate && action.endDate.getHours()) || 18,
        endMinute: (action.endDate && action.endDate.getMinutes()) || 0
      });
      return newState;

    case "quote_append_slot_multi": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      quote.slots.push({
        kind: "multi-day",
        dateRange: [new Date(), addDays(new Date(), 1)],
        startHour: 9,
        startMinute: 0,
        endHour: 18,
        endMinute: 0
      });
      return newState;
    }

    case "quote_remove_slot": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      quote.slots.splice(action.index, 1);
      return newState;
    }

    case "quote_update_total": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];

      if (!quote) {
        return state;
      }

      const grandTotal = computeCostItemsSummary(
        quote.costItems,
        quote.discount
      )[2];

      quote.value = grandTotal;

      return newState;
    }

    case "quote_update_discount": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];

      if (action.value && action.value.length) {
        try {
          quote.discount = parseInt(action.value);
        } catch (err) {
          quote.discount = 0;
        }
      } else {
        quote.discount = 0;
      }

      quote.discountText = action.value;

      return newState;
    }

    // COST ITEMS

    case "append_cost_item": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      quote.costItems.push(createEmptyCostItem({ vatRate: action.vatRate }));
      return newState;
    }

    case "remove_cost_item": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      quote.costItems.splice(action.index, 1);
      return newState;
    }

    case "update_cost_item": {
      const newState = Array.from(state);
      const booking = newState.find(booking => booking.id === action.booking);
      const quote = booking.quotes[action.quote];
      const constItem = quote.costItems[action.index];
      constItem[action.key] = action.value;
      return newState;
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
