export const CUSTOMER_OPTION_CREATE_USER  = -10;
export const CUSTOMER_OPTION_CASUAL_USER  = -11;
export const CALENDAR_REDIRECT_VALUE      = 'returnUrl='

export const BOOKING_COLOR_CONDITION_KEYS = [
  // {
  //   condition_key: { value:'slot_type', label: 'Slot Type' },
  //   condition_types: [
  //     { value: 'equal', label:'Is Equal To' }
  //   ],
  //   condition_values: [
  //     { value: 'single_day', label: 'Single Day' },
  //     { value: 'multi_day', label: 'Multi Day'}
  //   ]
  // },
  {
    condition_key: {
      value: 'payment_status', label: 'The Payment Status',
    },
    condition_types: [
      { value: 'equal', label: 'Is Equal To' },
      { value: 'not_equal', label: 'Is Not Equal' }
    ],
    condition_values: [
      { value: 'enquiry', label: 'Enquiry' },
      { value: 'proposal', label: 'Proposal' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'paid', label: 'Paid' }
    ]    
  },  
  {
    condition_key: {
      value: 'title', label: 'Title',
    },
    condition_types: [
      {value: 'contains', label: 'Contains'},
      {value: 'not_contains', label: 'Does Not Contains'}
    ],    
  },
]

export const BOOKING_COLORS = [
  '#6389ea', 
  '#4a9454', 
  '#F2D600', 
  '#FF9317', 
  '#EB5A46',
  '#C377E0',
  '#FF80CE',
  '#00C2E0',
  '#4E8EF0',
  '#51E898',
  '#4d4d4d',
  '#a9a9a9',
]

export const getSubDomain = () => {
  const a = window.location.href
  return a.substring(a.indexOf('://') + 3, a.indexOf('.'))  
}

export const getReturnUrlSlots = () => {
  const startDateStr = window.location.href.substring(
    window.location.href.indexOf('start=') + 'start='.length,
    window.location.href.indexOf('end=')
  )
  const endDateStr = window.location.href.substring(
    window.location.href.indexOf('end=') + 'end='.length,
    window.location.href.length
  )
  return ({start: new Date(parseInt(startDateStr)), end: new Date(parseInt(endDateStr))})
}

export const DASHBOARD_RECENT_BOOKINGS_PANEL    = 'Dashboard Recent Bookings'
export const DASHBOARD_UPCOMING_BOOKING_PANEL   = 'Upcoming Bookings'

export const LAST_7_DAYS      = 'Last 7 days'
export const LAST_30_DAYS     = 'Last 30 days'
export const NEXT_7_DAYS      = 'Next 7 days'
export const NEXT_30_DAYS     = 'Next 30 days'