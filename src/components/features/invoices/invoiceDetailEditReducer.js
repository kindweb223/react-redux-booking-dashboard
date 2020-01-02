import { addDays } from "date-fns";
import { createEmptyCostItem } from "../../../models/bookings";
import { computeCostItemsSummary } from "../../../utils/costItemsMath";

function invoiceDetailEditReducer(state, action) {
  switch (action.type) {
    case "update_value": {
      return {
        ...state,
        [action.key]: action.value
      };
    }
    // SLOTS
    case "update_slot": {
      const newState = { ...state };
      const slot = state.slots[action.index];
      slot[action.key] = action.value;
      return newState;
    }
    case "update_multiday_slot_start": {
      const newState = { ...state };
      const slot = state.slots[action.index];
      slot.dateRange[0] = action.value;
      return newState;
    }
    case "update_multiday_slot_end": {
      const newState = { ...state };
      const slot = state.slots[action.index];
      slot.dateRange[1] = action.value;
      return newState;
    }
    case "update_slot_start_time": {
      const newState = { ...state };
      const slot = state.slots[action.index];
      slot.startHour = action.date.getHours();
      slot.startMinute = action.date.getMinutes();
      return newState;
    }
    case "update_slot_end_time": {
      const newState = { ...state };
      const slot = state.slots[action.index];
      slot.endHour = action.date.getHours();
      slot.endMinute = action.date.getMinutes();
      return newState;
    }

    case "append_slot":
      const newState = { ...state };
      newState.slots.push({
        kind: "single-day",
        date: action.date || new Date(),
        startHour: (action.startDate && action.startDate.getHours()) || 9,
        startMinute: (action.startDate && action.startDate.getMinutes()) || 0,
        endHour: (action.endDate && action.endDate.getHours()) || 18,
        endMinute: (action.endDate && action.endDate.getMinutes()) || 0
      });
      return newState;

    case "append_slot_multi": {
      const newState = { ...state };
      newState.slots.push({
        kind: "multi-day",
        dateRange: [new Date(), addDays(new Date(), 1)],
        startHour: 9,
        startMinute: 0,
        endHour: 18,
        endMinute: 0
      });
      return newState;
    }

    case "remove_slot": {
      const newState = { ...state };
      newState.slots.splice(state.index, 1);
      return newState;
    }

    // COST ITEMS

    case "append_cost_item": {
      const newState = { ...state };
      newState.costItems.push(createEmptyCostItem({ vatRate: action.vatRate }));

      newState.grand_total = computeCostItemsSummary(
        newState.costItems,
        newState.discount
      )[2];

      return newState;
    }

    case "remove_cost_item": {
      const newState = { ...state };
      newState.costItems.splice(action.index, 1);

      newState.grand_total = computeCostItemsSummary(
        newState.costItems,
        newState.discount
      )[2];

      return newState;
    }

    case "update_cost_item": {
      const newState = { ...state };
      const costItem = state.costItems[action.index];
      costItem[action.key] = action.value;

      newState.costItems = [
        ...newState.costItems.map((item, nIndex) => {
          if (nIndex === action.index)
            return costItem;
          else return item;
        })
      ]
      newState.grand_total = computeCostItemsSummary(
        newState.costItems,
        newState.discount
      )[2];

      return newState;
    }

    case "update_discount": {
      const newState = { ...state };

      if (action.value && action.value.length) {
        try {
          newState.discount = parseInt(action.value);
        } catch (err) {
          newState.discount = 0;
        }
      } else {
        newState.discount = 0;
      }

      newState.discountText = action.value;
      newState.grand_total = computeCostItemsSummary(
        newState.costItems,
        newState.discount
      )[2];

      return newState;
    }

    case "update_total": {
      const newState = { ...state };
      const grand_total = computeCostItemsSummary(
        state.costItems,
        state.discount
      )[2];
      newState.grand_total = grand_total;
      return newState;
    }

    default:
      throw new Error();
  }
}

export default invoiceDetailEditReducer;
