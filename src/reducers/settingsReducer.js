import uuidV4 from "../utils/uuidV4";
import reorder from "../utils/reorder";
import spacesColors from "../models/spacesColors";

function settingsReducer(state = {}, action) {
  switch (action.type) {
    case "update_settings_value": {
      const key = action.key;
      const value = action.value;
      return {
        ...state,
        [key]: value
      };
    }
    case "update_settings_default_vat_rate": {
      return {
        ...state,
        defaultVatRateText: action.value,
        defaultVatRate: parseFloat(action.value)
      };
    }
    case "toggle_custom_status": {
      const bookingStatuses = Array.from(state.bookingStatuses);
      bookingStatuses[action.index].enabled = !bookingStatuses[action.index]
        .enabled;

      return {
        ...state,
        bookingStatuses
      };
    }
    case "update_custom_status_name": {
      const bookingStatuses = Array.from(state.bookingStatuses);
      bookingStatuses[action.index].name = action.name;

      return {
        ...state,
        bookingStatuses
      };
    }
    case "remove_custom_status": {
      const bookingStatuses = Array.from(state.bookingStatuses);
      bookingStatuses.splice(action.index, 1);

      return {
        ...state,
        bookingStatuses
      };
    }
    case "append_custom_status": {
      const bookingStatuses = Array.from(state.bookingStatuses);
      bookingStatuses.push({
        id: uuidV4(),
        name: "",
        type: "custom",
        enabled: true
      });

      return {
        ...state,
        bookingStatuses
      };
    }
    case "reorder_status": {
      const bookingStatuses = reorder(
        state.bookingStatuses,
        action.from,
        action.to
      );
      return {
        ...state,
        bookingStatuses
      };
    }

    // VENUES AND SPACES

    case "add_venue": {
      return {
        ...state,
        venues: [
          { id: uuidV4(), name: action.name, spaces: [] },
          ...state.venues
        ]
      };
    }
    case "edit_venue": {
      const newState = { ...state };
      newState.venues[action.index].name = action.name;
      return newState;
    }
    case "delete_venue": {
      const newState = { ...state };
      newState.venues.splice(action.index, 1);
      return newState;
    }
    case "add_space": {
      const randomColor =
        spacesColors[Math.floor(Math.random() * spacesColors.length)];

      const newState = { ...state };
      const spaces = newState.venues[action.venue].spaces;
      newState.venues[action.venue].spaces = [
        { name: action.name, id: uuidV4(), accentColor: randomColor },
        ...spaces
      ];
      return newState;
    }
    case "edit_space": {
      const newState = { ...state };
      newState.venues[action.venue].spaces[action.space].name = action.name;
      return newState;
    }
    case "delete_space": {
      const newState = { ...state };
      newState.venues[action.venue].spaces.splice(action.space, 1);
      return newState;
    }

    default:
      return state;
  }
}

export default settingsReducer;
