import React ,{ useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import colors from '../../../style/colors'
import H3 from '../../../typography/H3'
import P2 from '../../../typography/P2'

import { AppReducerContext } from '../../../../contexts/AppReducerContext'
import { updatedDate } from '../../../../utils/dates'

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  background-color: white;
  box-shadow: 0 5px 15px 5px rgba(164, 173, 186, 0.25);
  border-radius: 3px;
  margin-bottom: 2em;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #E6E8E9;
`

const NameColumn = styled(P2)`
  width: 30%;
  margin-top: 0.6em;
`
const ValueColmun = styled(P2)`
  width: 35%;
  text-align: right;
  margin-top: 0.6em;
`

const TopVenueTable = ({
  data
}) => {

  const { state, dispatch } = useContext(AppReducerContext);  
  const [topVenueData, setTopVenueData] = useState({title: "", spaces: []});

  useEffect(() => {
    setTopVenuFunc(state.bookings.bookings)
  }, [
    state.bookings.bookings
  ])

  const checkBookingInDateRange = (booking, startDate, endDate) => {
    let isInclude = false;
    booking.slots.forEach(itemOne => {
      if (isInclude) return
      if (itemOne.kind === 'single-day') {
        if (startDate <= moment(itemOne.date).valueOf() && moment(itemOne.date).valueOf() <= endDate) {                
          isInclude = true            
          return
        }
      } else if(itemOne.kind === 'multi-day') {
        if (
          startDate <= updatedDate(itemOne.dateRange[0], itemOne.startHour, itemOne.startMinute).valueOf() && 
          updatedDate(itemOne.dateRange[1], itemOne.endHour, itemOne.endMinute).valueOf() <= endDate
        ) {                
          isInclude = true            
          return
        }
      }
    })
    return isInclude;
  }
  
  const setTopVenuFunc = bookings => {    
    const endDay = moment().endOf('day').valueOf()
    const startDay = moment().subtract(1, 'months').startOf('month').startOf('day').valueOf()

    const filteredOne = [];
    bookings.forEach(item => {      
      let isInclude = false;
      item.slots.forEach(itemOne => {
        if (isInclude) return
        if (itemOne.kind === 'single-day') {
          if (
            startDay <= updatedDate(itemOne.date, itemOne.startHour, itemOne.startMinute).valueOf() && 
            updatedDate(itemOne.date, itemOne.endHour, itemOne.endMinute).valueOf() <= endDay
          ) {
            filteredOne.push(item)
            isInclude = true            
            return
          }
        } else if(itemOne.kind === 'multi-day') {
          if (
            startDay <= updatedDate(itemOne.dateRange[0], itemOne.startHour, itemOne.startMinute).valueOf() &&
            updatedDate(itemOne.dateRange[1], itemOne.endHour, itemOne.endMinute).valueOf() <= endDay
          ) {
            filteredOne.push(item)
            isInclude = true            
            return
          }
        }
      })
    })
    
    let sameVenues = [];    
    filteredOne.forEach((item, nIndex) => {
      if (item.venue && item.venue.id) {
        const filterOne = sameVenues.filter(itemOne => itemOne.id === item.venue.id)
        if (filterOne.length > 0)        
          sameVenues = [
            ...sameVenues.map(itemTwo => {
              if (itemTwo.id === item.venue.id)
                return {...itemTwo, count: itemTwo.count + 1, venue: item.venue}
              else return itemTwo
            })
          ]
        else 
          sameVenues.push({id: item.venue.id, count: 1, venue: item.venue})
      }
    })

    let topValue = 0;
    sameVenues.forEach(item => {
      if (item.count > topValue)
      topValue = item.count;
    })
    
    let topVenue = sameVenues.filter(item => item.count === topValue)[0]
    
    let spaceNames = []
    filteredOne.forEach(item => {
      if (item.venue && item.venue.id && topVenue && item.venue.id === topVenue.id) {
        if (item.space && item.space.id)
          spaceNames.push(item.space.id)
      }
    })

    spaceNames = spaceNames.filter(function(item, pos) {
      return spaceNames.indexOf(item) == pos;
    })

    let spaces = [];
    spaceNames.forEach(item => {
      const startOfLastMonth  = startDay
      const endOfLastMonth    = moment(startDay).endOf('month').valueOf()
      const startOfThisMonth  = moment(endDay).startOf('month').valueOf()
      const endOfThisMonth    = endDay      
            
      const lastMonths = filteredOne.filter(itemBooking => {
        if (itemBooking.space.id === item) {
          return checkBookingInDateRange(itemBooking, startOfLastMonth, endOfLastMonth)
        } return false
      })
      
      const thisMonths = filteredOne.filter(itemBooking => {
        if (itemBooking.space.id === item) {
          return checkBookingInDateRange(itemBooking, startOfThisMonth, endOfThisMonth)
        } else return false
      })

      const selectedSpace = filteredOne.filter(itemTwo => itemTwo.spaceId === item)[0]
      spaces.push({ 
        name: selectedSpace.space.name, 
        lastMonth: lastMonths.length,
        thisMonth: thisMonths.length,
      })

    })

    setTopVenueData({
      title: (topVenue && topVenue.venue && topVenue.venue.name) ? topVenue.venue.name : "",
      spaces,
    })
  }
  
  return (
    <PanelDiv>
      <H3>Top Venue : {topVenueData.title}</H3>
      <Row>
        <NameColumn style={{color: `${colors.grey}`}}>Space</NameColumn>
        <ValueColmun style={{color: `${colors.grey}`}}>This month</ValueColmun>
        <ValueColmun style={{color: `${colors.grey}`}}>Last month</ValueColmun>
      </Row>
      {topVenueData.spaces.map((item, nIndex) => {
        return (
          <Row key={nIndex}>
            <NameColumn>{item.name}</NameColumn>
            <ValueColmun>{item.lastMonth}</ValueColmun>
            <ValueColmun>{item.thisMonth}</ValueColmun>
          </Row>
        )
      })}      
    </PanelDiv>
  )
}

export default TopVenueTable