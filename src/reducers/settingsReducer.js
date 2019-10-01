import reorder from "../utils/reorder";

import {
  REQUEST_GET_VENUE,
  GET_VENUE_SUCCESS,
  GET_VENUE_ERROR,
  REQUEST_ADD_VENUE,
  GET_ADD_VENUE_SUCCESS,
  GET_ADD_VENUE_ERROR,
  REQUEST_DELETE_VENUE,
  GET_DELETE_VENUE_SUCCESS,
  GET_DELETE_VENUE_ERROR,
  REQUEST_EDIT_VENUE,
  GET_EDIT_VENUE_SUCCESS,
  GET_EDIT_VENUE_ERROR,
  REQUEST_GET_VENUE_SPACES,
  GET_VENUE_SPACES_SUCCESS,
  GET_VENUE_SPACES_ERROR,
  REQUEST_ADD_VENUE_SPACE,
  GET_ADD_VENUE_SPACE_SUCCESS,
  GET_ADD_VENUE_SPACE_ERROR,
  REQUEST_EDIT_VENUE_SPACE,
  GET_EDIT_VENUE_SPACE_SUCCESS,
  GET_EDIT_VENUE_SPACE_ERROR,
  REQUEST_DELETE_VENUE_SPACE,
  GET_DELETE_VENUE_SPACE_SUCCESS,
  GET_DELETE_VENUE_SPACE_ERROR,
  REQUEST_GET_BOOKINGSTATUS,
  GET_BOOKING_STATUS_SUCCESS,
  GET_BOOKING_STATUS_ERROR,
  REQUEST_ADD_BOOKING_STATUS,
  GET_ADD_BOOKING_STATUS_SUCCESS,
  GET_ADD_BOOKING_STATUS_ERROR,
  REQUEST_UPDATE_BOOKING_STATUS,
  GET_UPDATE_BOOKING_STATUS_SUCCESS,
  GET_UPDATE_BOOKING_STATUS_ERROR,
  REQUEST_DELETE_BOOKING_STATUS,
  GET_DELETE_BOOKING_STATUS_SUCCESS,
  GET_DELETE_BOOKING_STATUS_ERROR,  
  APPEND_CUSTOM_STATUS,
  REMOVE_NEW_BOOKING_STATUS,
  SET_BOOKING_STATUS_PAGE_STATUS,
  REQUEST_GET_COMPANYINFO,
  GET_COMPANYINFO_SUCCESS,
  GET_COMPANYINFO_ERROR,
  REQUEDST_UPDATE_COMPANYINFO,
  GET_UPDATE_COMPANYINFO_SUCCESS,
  GET_UPDATE_COMPANYINFO_ERROR,
  CHANGE_COMPANY_INFO,
  UPDATE_ALL_BOOKINGSTATUS_SUCCESS,
} from "./actionType";

function settingsReducer(state = {}, action) {
  switch (action.type) {
    case APPEND_CUSTOM_STATUS: {
      const bookingStatuses = Array.from(state.bookingStatuses);
      bookingStatuses.push({
        id: -1,
        name: "",
        type: "custom",
        active: true
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

    case UPDATE_ALL_BOOKINGSTATUS_SUCCESS:{
      return {
        ...state,
        bookingStatusActionLoading: false,
        bookingStatuses: [ ...action.payload ],
      }
    }
    // VENUES AND SPACES
    case REQUEST_GET_VENUE: {
      return {
        ...state,
        loading: true,
      }
    }
    case GET_VENUE_SUCCESS: {
      return {
        ...state,
        loading: false,
        venues: [
          ...action.payload
        ]
      }
    }
    case GET_VENUE_ERROR: {
      return {
        ...state,
        loading: false,
        venues: [],
      }
    }
    case REQUEST_ADD_VENUE: {
      return {
        ...state,
        venueActionLoading: true,
      }
    }
    case GET_ADD_VENUE_SUCCESS: {
      return {
        ...state,
        venueActionLoading: false,
        venues: [
          ...state.venues,
          action.payload
        ]
      }
    }
    case GET_ADD_VENUE_ERROR: {
      return {
        ...state,
        venueActionLoading: false,
      }
    }
    case REQUEST_DELETE_VENUE: {
      return {
        ...state,
        venueActionLoading: true,
      }
    }
    case GET_DELETE_VENUE_SUCCESS: {
      return {
        ...state,
        venueActionLoading: false,
        venues: [...state.venues.filter(item => item.id !== action.payload)]
      }
    }
    case GET_DELETE_VENUE_ERROR: {
      return {
        ...state,
        venueActionLoading: false,
      }
    }
    case REQUEST_EDIT_VENUE: {
      return {
        ...state,
        venueActionLoading: true,
      }
    }
    case GET_EDIT_VENUE_SUCCESS: {
      return {
        ...state,
        venueActionLoading: false,
        venues: [
          ...state.venues.map(item => {
            if (item.id === action.payload.id)
              item.name = action.payload.name;
            return item;
          })
        ]
      }
    }
    case GET_EDIT_VENUE_ERROR: {
      return {
        ...state,
        venueActionLoading: false,
      }
    }
    case REQUEST_GET_VENUE_SPACES: {
      return {
        ...state,
        spacesLoading: true,
      }
    }
    case GET_VENUE_SPACES_SUCCESS: {
      return {
        ...state,
        spacesLoading: false,
        selectedVenueSpaces: [...action.payload]
      }
    }
    case GET_VENUE_SPACES_ERROR: {
      return {
        ...state,
        spacesLoading: false,
        selectedVenueSpaces: [],
      }
    }
    case REQUEST_ADD_VENUE_SPACE: {
      return {
        ...state,
        spaceActionLoading: true,
      }
    }
    case GET_ADD_VENUE_SPACE_SUCCESS: {
      return {
        ...state,
        spaceActionLoading: false,
        selectedVenueSpaces: [...state.selectedVenueSpaces, action.payload]
      }
    }
    case GET_ADD_VENUE_SPACE_ERROR: {
      return {
        ...state,
        spaceActionLoading: false,
      }
    }
    case REQUEST_EDIT_VENUE_SPACE: {
      return {
        ...state,
        spaceActionLoading: true,
      }
    }
    case GET_EDIT_VENUE_SPACE_SUCCESS: {
      return {
        ...state,
        spaceActionLoading: false,
        selectedVenueSpaces: [
          ...state.selectedVenueSpaces.map(item => {
            if (item.id === action.payload.id)
              item.name = action.payload.name;
            return item;
          })
        ]
      }
    }
    case GET_EDIT_VENUE_SPACE_ERROR: {
      return {
        ...state,
        spaceActionLoading: false,
      }
    }
    case REQUEST_DELETE_VENUE_SPACE: {
      return {
        ...state,
        spaceActionLoading: true,
      }
    }
    case GET_DELETE_VENUE_SPACE_SUCCESS: {
      return {
        ...state,
        spaceActionLoading: false,
        selectedVenueSpaces: state.selectedVenueSpaces.filter(item => item.id !== action.payload)
      }
    }
    case GET_DELETE_VENUE_SPACE_ERROR: {
      return {
        ...state,
        spaceActionLoading: false,
      }
    }
    // BOOKING STATUS SECTION
    case REQUEST_GET_BOOKINGSTATUS: {
      return {
        ...state,
        bookingStatusesLoading: true,
      }
    }
    case GET_BOOKING_STATUS_SUCCESS: {
      return {
        ...state,
        bookingStatusesLoading: false,
        bookingStatuses: [ ...action.payload ],
      }
    }
    case GET_BOOKING_STATUS_ERROR: {
      return {
        ...state,
        bookingStatusesLoading: false,
        bookingStatuses: [],
      }
    }
    case SET_BOOKING_STATUS_PAGE_STATUS: {
      return {
        ...state,
        enableBookingSection: action.payload,
      }
    }
    case REQUEST_ADD_BOOKING_STATUS: {
      return {
        ...state,
        bookingStatusActionLoading: true,
      }
    }
    case GET_ADD_BOOKING_STATUS_SUCCESS: {
      return {
        ...state,
        bookingStatusActionLoading: false,
        bookingStatuses:[
          ...state.bookingStatuses.map(item => {
            if (item.id === -1)
              return action.payload;
            else return item;
          })
        ]
      }
    }
    case GET_ADD_BOOKING_STATUS_ERROR: {
      return {
        ...state,
        bookingStatusActionLoading: false,
      }
    }
    case REQUEST_UPDATE_BOOKING_STATUS: {
      return {
        ...state,
        bookingStatusActionLoading: true,
      }
    }
    case GET_UPDATE_BOOKING_STATUS_SUCCESS: {
      return {
        ...state,
        bookingStatusActionLoading: false,
        bookingStatuses:[
          ...state.bookingStatuses.map(item => {
            if (item.id === action.payload.id)
              return action.payload;
            else return item;
          })
        ]
      }
    }
    case GET_UPDATE_BOOKING_STATUS_ERROR: {
      return {
        ...state,
        bookingStatusActionLoading: false,
      }
    }
    case REQUEST_DELETE_BOOKING_STATUS: {
      return {
        ...state,
        bookingStatusActionLoading: true,
      }
    }
    case GET_DELETE_BOOKING_STATUS_SUCCESS: {
      return {
        ...state,
        bookingStatusActionLoading: false,
        bookingStatuses: [...state.bookingStatuses.filter(item => item.id !== action.payload)]
      }
    }
    case GET_DELETE_BOOKING_STATUS_ERROR: {
      return {
        ...state,
        bookingStatusActionLoading: false,
      }    
    }
    case REMOVE_NEW_BOOKING_STATUS: {
      return {
        ...state,
        bookingStatuses: [ ...state.bookingStatuses.filter(item => item.id !== -1)],
        enableBookingSection: true,
      }
    }
    case REQUEST_GET_COMPANYINFO: {
      return {
        ...state,
        companyLoading: true,
      }
    }
    case GET_COMPANYINFO_SUCCESS: {
      return {
        ...state,
        companyLoading: false,
        companyInfo: { ...action.payload },
      }
    }
    case GET_COMPANYINFO_ERROR: {
      return {
        ...state,
        companyLoading: false,
      }
    }
    case REQUEDST_UPDATE_COMPANYINFO:
      return {
        ...state,
        companyLoading: true,
      }
    case GET_UPDATE_COMPANYINFO_SUCCESS:
      return {
        ...state,
        companyLoading: false,
        companyInfo: { ...action.payload }
      }
    case GET_UPDATE_COMPANYINFO_ERROR:
      return {
        ...state,
        companyLoading: false,        
      }
    case CHANGE_COMPANY_INFO:
      const newCompanyInfo = { ... state.companyInfo };
      newCompanyInfo[action.payload.key] = action.payload.value
      return {
        ...state,
        companyInfo: { ...newCompanyInfo }
      }
    default:
      return state;
  }
}

export default settingsReducer;
