export const CUSTOMER_OPTION_CREATE_USER = -10;
export const CUSTOMER_OPTION_CASUAL_USER = -11;

export const BOOKING_COLOR_CONDITION_KEYS = [
  {
    condition_key: {
      value: 'title',
      label: 'Title',
    },
    condition_types: [
      {value: 'contains', label: 'Contains'},
      {value: 'not_contains', label: 'Does Not Contains'}
    ],    
  },
  {
    condition_key: {
      value: 'payment_status',
      label: 'The Payment Status',
    },
    condition_types: [
      {
        value: 'equal',
        label: 'Is Equal To',
      },
      {
        value: 'not_equal',
        label: 'Is Not Equal',
      }
    ],
    condition_values: [
      {
        value: 'enquiry',
        label: 'Enquiry',
      },
      {
        value: 'proposal',
        label: 'Proposal',
      },
      {
        value: 'accepted',
        label: 'Accepted',
      },
      {
        value: 'paid',
        label: 'Paid'
      }
    ]    
  },
]