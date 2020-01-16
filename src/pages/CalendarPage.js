import React, {useState, useContext, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import useInterval from 'react-useinterval';
import Grid from "../components/layout/Grid";
import constants from "../components/layout/constants";
import SpinnerContainer from "../components/layout/Spinner";
import Calendar from "../components/features/calendar";
import TabbedBookingsList from "../components/features/tabbedBookingsList";
import BookingDetail from "../components/features/bookingDetail/bookingDetail";
import Modal from "../components/modals/Modal";
import BookingDetailEdit from "../components/features/bookingDetail/bookingDetailEdit";
import BookingEmailLogin from '../components/features/bookingDetail/bookingEmailLogin'
import { AppReducerContext } from "../contexts/AppReducerContext";
import { createEmptyBooking } from "../models/bookings";
import { bookingToEvents } from "../models/bookingToEvents";

import {
  REQUSET_ADD_BOOKING, GET_ADD_BOOKING_SUCCESS, GET_ADD_BOOKING_ERROR,
  REQUEST_UPDATE_BOOKING, GET_UPDATE_BOOKING_SUCCESS, GET_UPDATE_BOOKIG_ERROR,
  GET_BOOKING_BOOKINGSATTUS_ERROR,
  GET_BOOKING_BOOKINGSTATUS_SUCCESS, GET_BOOKINGS_ERROR,
  GET_BOOKINGS_SUCCESS, GET_CUSTOMERS_ERROR, GET_CUSTOMERS_SUCCESS, GET_VENUE_ERROR, GET_VENUE_SUCCESS,
  REQUEST_GET_BOOKING_BOOKINGSTATUS,
  REQUEST_GET_BOOKINGS, REQUEST_GET_CUSTOMERS,
  REQUEST_GET_VENUE,
  CLEAR_BOOKING_DATA,
  GET_ADD_CUSTOMER_SUCCESS,
  REQUEST_GET_CUSTOM_BOOKING_COLOR, GET_CUSTOM_BOOKING_COLOR_SUCCESS, GET_CUSTOM_BOOKING_COLOR_ERROR,
  GET_CALENDAR_CUSTOM_VIEW_SUCCESS, GET_CALENDAR_CUSTOM_VIEW_ERROR,
  GET_USERS_ALL_SPACES_SUCCESS, GET_USERS_ALL_SPACES_ERROR,
  GET_CALENDAR_SETTING_ERROR, SET_CALENDAR_SETTING_DATA,
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
  getReturnUrlSlots,
} from '../constants'

import CONFIG from '../config'
import moment from "moment";

const CalendarPage = props => {

  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);

  const [createBookingModalInfo, setCreateBookingModalInfo] = useState(null);
  const [showEnterEmailModal, setShowEnterEmailModal] = useState(false);
  const [subdomain, setSubdomain] = useState(getSubDomain())

  const { state, dispatch } = useContext(AppReducerContext);
  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)

  useInterval(() => {
    if (state.calendarSettings.viewMode === 'day') {
      const currentTimeIndicator = document.getElementsByClassName('rbc-current-time-indicator')[0]
      if (currentTimeIndicator) {
                
        if (currentTimeIndicator.hasChildNodes()) {
          const indicatorDiv = document.getElementsByClassName('current-time-indicator-value')[0]
          indicatorDiv.innerText = moment().format('h:mm')
        } else {
          const currentTimeElement = document.createElement('div')
          currentTimeElement.className= 'current-time-indicator-value'
          currentTimeElement.innerText = moment().format('h:mm')
          currentTimeIndicator.appendChild(currentTimeElement)
        }                
      }      
    }    
  }, 1000)

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
      const loadDatas = async () => {
        // get calendar settings
        try{
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
    
      // get bookings
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
        
        // get customers        
        if (!(state.customers.customers && state.customers.customers.length)) {
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
        
        // get venus        
        if (!state.settings.venues && state.settings.venues.length > 0) {
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
    
        // get company        
        if (!state.settings.companyInfo.id) {
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
    
        // get bookingstatus        
        if(!(state.bookings.bookingStatus && state.bookings.bookingStatus.length > 0)) {
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
    
        // get booking colors                  
        try {
          dispatch({ type: REQUEST_GET_CUSTOM_BOOKING_COLOR })
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
        
        // get calendar views        
        try {        
          const res = await axios.get('/calendarview')
          
          dispatch({ 
            type: GET_CALENDAR_CUSTOM_VIEW_SUCCESS,
            payload: res.data.calendarView ? res.data.calendarView : {},
          })
        } catch (err) {
          dispatch({ type: GET_CALENDAR_CUSTOM_VIEW_ERROR })
        }
        
        //get all spaces        
        try {
          const res = await axios.get('/userspaces')
          dispatch({ 
            type: GET_USERS_ALL_SPACES_SUCCESS,
            payload: res.data.spaces,
          })
        } catch (err) {
          dispatch({ type: GET_USERS_ALL_SPACES_ERROR })
        }

        // check if returnUrl exist
        if (window.location.href.indexOf('start=') > 0) {    
          const slots = getReturnUrlSlots()        
          setCreateBookingModalInfo({ startDate: slots.start, endDate: slots.end });
          setShowCreateBookingModal(true);
        } else if (props.history.location.state && props.history.location.state.booking) {
          setSelectedBookingID(props.history.location.state.booking.id)
        }
        setLoading(false)
      }
      loadDatas();
    } else {
      //without token
      // check subdomain is exsit
      const checkSubdomain = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`/companies/subdomain/${subdomain}`)
          if (res.data.success) {
      
            dispatch({
              type: GET_COMPANYINFO_SUCCESS,
              payload: {...res.data.company},
            })
            
            // Get bookinngs with subdomain
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

            // Get Spaces with subdomain
            try {
              const res = await axios.get(`spaces/subdomain/${subdomain}`)
              dispatch({ 
                type: GET_USERS_ALL_SPACES_SUCCESS,
                payload: res.data.spaces,
              })
            } catch (err) {
              dispatch({ type: GET_USERS_ALL_SPACES_ERROR })
            }
            
            // get calendar view
            try {        
              const res = await axios.get(`/calendarview/subdomain/${subdomain}`)
              
              dispatch({ 
                type: GET_CALENDAR_CUSTOM_VIEW_SUCCESS,
                payload: res.data.calendarView ? res.data.calendarView : {},
              })
            } catch (err) {
              dispatch({ type: GET_CALENDAR_CUSTOM_VIEW_ERROR })
            }            
            
            // get booking status
            try {
              dispatch({ type: REQUEST_GET_BOOKING_BOOKINGSTATUS });
      
              const res = await axios.get(`/statuses/subdomain/${subdomain}`);
      
              dispatch({
                type: GET_BOOKING_BOOKINGSTATUS_SUCCESS,
                payload: res.data.statuses
              });
            } catch(err) {
              dispatch({ type: GET_BOOKING_BOOKINGSATTUS_ERROR });
            }        
        
            // get booking color
            try {
              dispatch({ type: REQUEST_GET_CUSTOM_BOOKING_COLOR })
              const res = await axios.get(`/bookingcolor/subdomain/${subdomain}`)
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

            setLoading(false)
          } else window.location.replace(CONFIG.BASE_URL);
        } catch (err) {
          window.location.replace(CONFIG.BASE_URL);
        }
      }
      checkSubdomain();      
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

  useEffect(() => {
    if (showCreateBookingModal || showEnterEmailModal || selectedBookingID !== null)
      document.removeEventListener("keydown", handleKeyDown, false);
    else
      document.addEventListener('keydown', handleKeyDown, false);     
  }, [showCreateBookingModal, showEnterEmailModal, selectedBookingID !== null])
  
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
    if (state.auth.token && state.auth.token.length > 0) {      
      setShowCreateBookingModal(true);
      setCreateBookingModalInfo({ startDate: start, endDate: end });
    } else {
      setCreateBookingModalInfo({ startDate: start, endDate: end });
      setShowEnterEmailModal(true)
    }   
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
        loading={loading ? "true" : "false"} 
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
                handleClickSave(booking);
              }
              setShowCreateBookingModal(false);
            }}
            {...createBookingModalInfo}
          />
        </Modal>
        {
          showEnterEmailModal && (
            <Modal
              isOpen={showEnterEmailModal}
              onClose={() => {
                setShowEnterEmailModal(false)
                setCreateBookingModalInfo(null)
              }}
            >
              <BookingEmailLogin 
                startDate={createBookingModalInfo.startDate}
                endDate={createBookingModalInfo.endDate}
              />
            </Modal>
          )
        }        
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
