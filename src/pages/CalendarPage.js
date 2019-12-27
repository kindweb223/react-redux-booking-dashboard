import React, {useState, useContext, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from 'moment';
import Grid from "../components/layout/Grid";
import constants from "../components/layout/constants";
import SpinnerContainer from "../components/layout/Spinner";
import Calendar from "../components/features/calendar";
import { bookingToEvents } from "../models/bookingToEvents";
import TabbedBookingsList from "../components/features/tabbedBookingsList";
import BookingDetail from "../components/features/bookingDetail/bookingDetail";
import Modal from "../components/modals/modal";
import { AppReducerContext } from "../contexts/AppReducerContext";
import BookingDetailEdit from "../components/features/bookingDetail/bookingDetailEdit";
import { createEmptyBooking } from "../models/bookings";
import {
  REQUSET_ADD_BOOKING, GET_ADD_BOOKING_SUCCESS, GET_ADD_BOOKING_ERROR,
  REQUEST_UPDATE_BOOKING, GET_UPDATE_BOOKING_SUCCESS, GET_UPDATE_BOOKIG_ERROR,
  GET_BOOKING_BOOKINGSATTUS_ERROR,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS, GET_BOOKINGS_ERROR,
  GET_BOOKINGS_SUCCESS, GET_CUSTOMERS_ERROR, GET_CUSTOMERS_SUCCESS, GET_VENUE_ERROR, GET_VENUE_SUCCESS,
  REQUEST_GET_BOOKING_BOOKINGSTATUS,
  REQUEST_GET_BOOKINGS, REQUEST_GET_CUSTOMERS,
  REQUEST_GET_VENUE,
  REUQEST_GET_BOOKING_SETTINGS,
  CLEAR_BOOKING_DATA,
  GET_ADD_CUSTOMER_SUCCESS,
  REQUEST_GET_CUSTOM_BOOKING_COLOR, GET_CUSTOM_BOOKING_COLOR_SUCCESS, GET_CUSTOM_BOOKING_COLOR_ERROR,
  REQUEST_GET_CALENDAR_CUSTOM_VIEW, GET_CALENDAR_CUSTOM_VIEW_SUCCESS, GET_CALENDAR_CUSTOM_VIEW_ERROR,
  GET_USERS_ALL_SPACES_SUCCESS, GET_USERS_ALL_SPACES_ERROR,
  GET_CALENDAR_SETTING_SUCCESS, GET_CALENDAR_SETTING_ERROR, SET_CALENDAR_SETTING_DATA,
  GET_COMPANYINFO_SUCCESS, GET_COMPANYINFO_ERROR,
} from "../reducers/actionType";
import {
  setCalendarSettingAction,
  saveCalendarSettingAction,
} from '../actions/calendar'

import {
  CUSTOMER_OPTION_CREATE_USER,
  // CUSTOMER_OPTION_CASUAL_USER,
  getSubDomain,
} from '../constants'

import CONFIG from '../config'


const CalendarPage = props => {
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [createBookingModalInfo, setCreateBookingModalInfo] = useState(null);
  const [subdomain, setSubdomain] = useState(getSubDomain())

  const { state, dispatch } = useContext(AppReducerContext);
  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)
      
  useEffect(() => {
    localStorage.setItem('calendarsetting', JSON.stringify(state.calendarSettings))
  }, [state.calendarSettings])

  const handleKeyDown = useCallback((event) => {    
    const getViewMode = strValue => {
      if (strValue === 'd')
        return 'day'
      else if (strValue === 'w')
        return 'week'
      else if (strValue === 'm')
        return 'month'
      else return ''
    }

    if (props.history.location.pathname === "/calendar") {
      let calendarSettings = JSON.parse(localStorage.getItem('calendarsetting'))
      calendarSettings.selectedDate = new Date(calendarSettings.selectedDate)
      
      if (getViewMode(event.key) === '')
        return;
      if (calendarSettings.viewMode === 'day' && event.key === 'd')
        return;
      if (calendarSettings.viewMode === 'week' && event.key === 'w')
        return;
      if (calendarSettings.viewMode === 'month' && event.key === 'm')
        return;
      setCalendarSettingAction(dispatch, {...calendarSettings, viewMode: getViewMode(event.key)})      
    }
  }, []);


  useEffect(() => {
    setLoading(true);

    if (state.auth.token && state.auth.token.length > 0) {
      const getCalendarSetting = async () => {
        try {
          const res = await axios.get('/calendarsetting')   
          dispatch({ 
            type: SET_CALENDAR_SETTING_DATA,
            payload: {            
              ...res.data.calendarSetting,
              selectedDate: new Date(res.data.calendarSetting.selectedDate),
              loading: false,
            }
          })
        } catch (err) {
          dispatch({ type: GET_CALENDAR_SETTING_ERROR })
        }
      }
      getCalendarSetting();      

      const getBookings = async () => {
        try {
          dispatch({ type: REQUEST_GET_BOOKINGS });
  
          const res = await axios.get('/bookings');
          console.log('bookings');
          dispatch({
            type: GET_BOOKINGS_SUCCESS,
            payload: res.data.bookings
          })
        } catch (err) {
          dispatch({ type: GET_BOOKINGS_ERROR });
        }
      }
  
      getBookings();
  
      const getCustomers = async () => {
        try {
          dispatch({ type: REQUEST_GET_CUSTOMERS });
  
          const res = await axios.get('/customers');
          console.log('customers');
          dispatch({
            type: GET_CUSTOMERS_SUCCESS,
            payload: res.data.customers
          })
        } catch (err) {
          dispatch({ type: GET_CUSTOMERS_ERROR });
        }
      }
      if (!(state.customers.customers && state.customers.customers.length))
      getCustomers();
  
      const getVenue = async () => {
        try {
          dispatch({ type: REQUEST_GET_VENUE });
  
          const res = await axios.get('/venues');
          console.log('venues');
          const venues = res.data.venues;
          venues.map(item => {
            if (!item.spaces) {
              item.spaces = [];
            }
            return item;
          })
  
          dispatch({
            type: GET_VENUE_SUCCESS,
            payload: venues
          })
  
        } catch (err) {
          console.log("Get Venus Setting failed.")
          dispatch({ type: GET_VENUE_ERROR });
        }
      }
  
      if (!state.settings.venues && state.settings.venues.length > 0)
        getVenue();
  
      const getCompany = async () => {
        try {
          const res = await axios.get('/company');
          dispatch({
            type: GET_COMPANYINFO_SUCCESS,
            payload: {...res.data.company},
          })
        } catch (err) {
          dispatch({ type: GET_COMPANYINFO_ERROR });
        }
      }
      
      if (!state.settings.companyInfo.id)
        getCompany();
  
      const getBookingStatus = async () => {
  
        try {
          dispatch({ type: REQUEST_GET_BOOKING_BOOKINGSTATUS });
  
          const res = await axios.get('/statuses');
          console.log('statues');
  
          dispatch({
            type: GET_BOOKING_BOOKINGSTATUS_SUCCESS,
            payload: res.data.statuses
          });
        } catch(err) {
          dispatch({ type: GET_BOOKING_BOOKINGSATTUS_ERROR });
        }
  
      }
      if(!(state.bookings.bookingStatus && state.bookings.bookingStatus.length > 0))
      getBookingStatus();
  
      const getBookingColors = async () => {
        dispatch({ type: REQUEST_GET_CUSTOM_BOOKING_COLOR })
        try {
          const res = await axios.get('/bookingcolor')
          console.log('bookingcolor');
          if (res.data.bookingColor) {
            dispatch({
              type: GET_CUSTOM_BOOKING_COLOR_SUCCESS,
              payload: JSON.parse(res.data.bookingColor.color)
            })
          } else {
            dispatch({ type: GET_CUSTOM_BOOKING_COLOR_ERROR })  
          }
        } catch (err) {
          dispatch({ type: GET_CUSTOM_BOOKING_COLOR_ERROR })
        }      
      }
      getBookingColors();
  
      const getCalendarViews = async () => {
        try {        
          const res = await axios.get('/calendarview')
          
          dispatch({ 
            type: GET_CALENDAR_CUSTOM_VIEW_SUCCESS,
            payload: res.data.calendarView ? res.data.calendarView : {},
          })
        } catch (err) {
          dispatch({ type: GET_CALENDAR_CUSTOM_VIEW_ERROR })
        }
      }
      getCalendarViews();
  
      const getAllSpaces = async() => {
        try {
          const res = await axios.get('/userspaces')
          dispatch({ 
            type: GET_USERS_ALL_SPACES_SUCCESS,
            payload: res.data.spaces,
          })
        } catch (err) {
          dispatch({ type: GET_USERS_ALL_SPACES_ERROR })
        }
      }
      getAllSpaces();
    } else {
      //without token
      // check subdomain is exsit

      const checkSubdomain = async () => {
        try {
          const res = await axios.get(`/companies/subdomain/${subdomain}`)
          if (res.data.success) {
      
            dispatch({
              type: GET_COMPANYINFO_SUCCESS,
              payload: {...res.data.company},
            })
            
            // Get bookinngs with subdomain
            const getBookings = async () => {
              try {
                dispatch({ type: REQUEST_GET_BOOKINGS });
         
                const res = await axios.get(`/bookings/subdomain/${subdomain}`);
                
                dispatch({
                  type: GET_BOOKINGS_SUCCESS,
                  payload: res.data.bookings
                })
              } catch (err) {
                dispatch({ type: GET_BOOKINGS_ERROR });
              }
            }        
            getBookings();

            // Get Spaces with subdomain
            const getAllSpaces = async() => {
              try {
                const res = await axios.get(`spaces/subdomain/${subdomain}`)
                dispatch({ 
                  type: GET_USERS_ALL_SPACES_SUCCESS,
                  payload: res.data.spaces,
                })
              } catch (err) {
                dispatch({ type: GET_USERS_ALL_SPACES_ERROR })
              }
            }
            getAllSpaces();
            
            const getCalendarViews = async () => {
              try {        
                const res = await axios.get(`/calendarview/subdomain/${subdomain}`)
                
                dispatch({ 
                  type: GET_CALENDAR_CUSTOM_VIEW_SUCCESS,
                  payload: res.data.calendarView ? res.data.calendarView : {},
                })
              } catch (err) {
                dispatch({ type: GET_CALENDAR_CUSTOM_VIEW_ERROR })
              }
            }
            getCalendarViews();
      

          } else window.location.replace(CONFIG.BASE_URL);
        } catch (err) {
          window.location.replace(CONFIG.BASE_URL);
        }
      }
      checkSubdomain();      
  
      const getCustomers = async () => {
        try {
          dispatch({ type: REQUEST_GET_CUSTOMERS });
  
          const res = await axios.get('/customers');
          console.log('customers');
          dispatch({
            type: GET_CUSTOMERS_SUCCESS,
            payload: res.data.customers
          })
        } catch (err) {
          dispatch({ type: GET_CUSTOMERS_ERROR });
        }
      }
      if (!(state.customers.customers && state.customers.customers.length))
      getCustomers();          
    
      const getBookingStatus = async () => {
  
        try {
          dispatch({ type: REQUEST_GET_BOOKING_BOOKINGSTATUS });
  
          const res = await axios.get('/statuses');
          console.log('statues');
  
          dispatch({
            type: GET_BOOKING_BOOKINGSTATUS_SUCCESS,
            payload: res.data.statuses
          });
        } catch(err) {
          dispatch({ type: GET_BOOKING_BOOKINGSATTUS_ERROR });
        }
  
      }
      if(!(state.bookings.bookingStatus && state.bookings.bookingStatus.length > 0))
      getBookingStatus();
  
      const getBookingColors = async () => {
        dispatch({ type: REQUEST_GET_CUSTOM_BOOKING_COLOR })
        try {
          const res = await axios.get('/bookingcolor')
          console.log('bookingcolor');
          if (res.data.bookingColor) {
            dispatch({
              type: GET_CUSTOM_BOOKING_COLOR_SUCCESS,
              payload: JSON.parse(res.data.bookingColor.color)
            })
          } else {
            dispatch({ type: GET_CUSTOM_BOOKING_COLOR_ERROR })  
          }
        } catch (err) {
          dispatch({ type: GET_CUSTOM_BOOKING_COLOR_ERROR })
        }      
      }
      getBookingColors();
  
  
    }

    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
      let calendarSettings = JSON.parse(localStorage.getItem('calendarsetting'))
      calendarSettings.selectedDate = new Date(calendarSettings.selectedDate);
      saveCalendarSettingAction( dispatch, calendarSettings )
    };
  
  }, [])
  
  useEffect(() => {
    if (state.customBookingColor.bookingColors && state.bookings.bookings) {      
      setEvents(
        state.bookings.bookings && state.bookings.bookings.map(b => bookingToEvents(b, state.customBookingColor.bookingColors)).flat()
      )
    }
  }, [
    state.bookings.bookings, 
    state.customBookingColor.bookingColors,
  ])
  
  const handleClickSave = async (booking) => {
    setShowCreateBookingModal(false);

    if (booking === null) return;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (booking.id === -1) {
      try {

        dispatch({ type: REQUSET_ADD_BOOKING })
        const filteredStatus = state.bookings.bookingStatus.filter(item => item.name === "Enquiry");

        let resCustomer = {};
        let customerId = booking.customerId;

        if (booking.customerId === CUSTOMER_OPTION_CREATE_USER) {
          resCustomer = await axios.post(
            '/customers', 
            JSON.stringify({
              name: booking.customerData.name.value,
              phone: booking.customerData.phone.value,
              address: booking.customerData.address.value,
              email: booking.customerData.email.value,
              note: booking.customerData.note.value,
              vatNumber: booking.customerData.vatNumber.value,
            }), 
            config
          )
          dispatch({
            type: GET_ADD_CUSTOMER_SUCCESS,
            payload: resCustomer.data.customer,
          })
          customerId = resCustomer.data.customer.id;
        }

        const res = await axios.post(
          '/bookings',
          {
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: customerId,
            ownerId: booking.ownerId,
            slots: JSON.stringify(booking.slots),
            statusId: filteredStatus[0].id,
          },
          config
        );

        dispatch({
          type: GET_ADD_BOOKING_SUCCESS,
          payload: res.data.booking
        })

      } catch (err) {
        dispatch({ type: GET_ADD_BOOKING_ERROR })
      }
    } else {
      try {
        dispatch({ type: REQUEST_UPDATE_BOOKING })

        let resCustomer = {};
        let customerId = booking.customerId;

        if (booking.customerId === CUSTOMER_OPTION_CREATE_USER) {
          resCustomer = await axios.post(
            '/customers', 
            JSON.stringify({
              name: booking.customerData.name.value,
              phone: booking.customerData.phone.value,
              address: booking.customerData.address.value,
              email: booking.customerData.email.value,
              note: booking.customerData.note.value,
              vatNumber: booking.customerData.vatNumber.value,
            }), 
            config
          )
          dispatch({
            type: GET_ADD_CUSTOMER_SUCCESS,
            payload: resCustomer.data.customer,
          })
          customerId = resCustomer.data.customer.id;
        }

        const res = await axios.put(
          `/bookings/${booking.id}`,
          {
            eventName: booking.eventName,
            venueId: booking.venueId,
            spaceId: booking.spaceId,
            customerId: customerId,
            ownerId: booking.ownerId,
            statusId: booking.statusId,
            slots: JSON.stringify(booking.slots),
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
    }
  }

  const handleSelectSlot = ({ start, end }) => {
    setShowCreateBookingModal(true);
    setCreateBookingModalInfo({ startDate: start, endDate: end });
  };

  const onSelectEvent = event => {
    dispatch({
      type: CLEAR_BOOKING_DATA,
      payload: ""
    })
    setSelectedBookingID(event.bookingID);
  };

  return (
    <>
      <SpinnerContainer 
        loading={ (events && events.length <= 0) && (state.bookings.loadBooking || state.bookings.loadBookingAction) ? "true" : "false"} 
      />
      <Grid
        fullheight
        columns={`${!state.calendarSettings.viewExpand && constants.leftPanelWidth} 1fr`}
        style={{ height: "100%" }}        
      >
        {!state.calendarSettings.viewExpand && (
          <div style={{ overflow: "scroll" }}>
            <TabbedBookingsList
              onSelect={booking => setSelectedBookingID(booking.id)}
            />
          </div>
        )}

        <Modal
          isOpen={selectedBookingID !== null}
          onClose={() => setSelectedBookingID(null)}
        >
          <BookingDetail
            booking={state.bookings.bookings && state.bookings.bookings.find(b => b.id === selectedBookingID)}
          />
        </Modal>
        <Modal
          isOpen={showCreateBookingModal}
          onClose={() => setShowCreateBookingModal(false)}
        >
          <BookingDetailEdit
            booking={createEmptyBooking()}
            onEndEditing={booking => {
              if (booking) {
                handleClickSave(booking)
                // dispatch({ type: "upsert_booking", booking: booking });
              }
              setShowCreateBookingModal(false);
            }}
            {...createBookingModalInfo}
          />
        </Modal>
        <Calendar
          selectable
          events={events}
          onSelectEvent={onSelectEvent}
          onSelectSlot={handleSelectSlot}       
        />
      </Grid>
    </>
  );
};

export default withRouter(CalendarPage);
