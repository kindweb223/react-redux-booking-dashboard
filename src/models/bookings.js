import uuidV4 from "../utils/uuidV4";
import owners from "./owners";
import { addDays } from "../utils/dates";

function createEmptyBooking() {
  return {
    id: uuidV4(),
    received: new Date(),
    source: "Email",
    title: "",
    venue: null,
    space: null,
    status: "Enquiry",
    customer: null,
    owner: null,
    slots: [],
    invoices: [],
    quotes: [],
    currency: "GBP",
    discount: 0,
    total: 0
  };
}

function createEmptyInvoice(number, booking) {
  return {
    number: number,
    status: "Unpaid",
    created: new Date(),
    slots: (booking && Array.from(booking.slots)) || [],
    costItems: [],
    discount: 0,
    booking: booking,
    amount: 0
  };
}

function createEmptyQuote(booking) {
  return {
    created: new Date(),
    slots: Array.from(booking.slots) || [],
    costItems: [],
    value: 0,
    discount: 0
  };
}

function convertQuoteToInvoice(quote, invoiceNumber, booking) {
  return {
    number: invoiceNumber,
    status: "Unpaid",
    created: new Date(),
    slots: quote.slots,
    costItems: quote.costItems,
    discount: quote.discount,
    booking: booking,
    amount: quote.value
  };
}

function createEmptyCostItem({ vatRate }) {
  return {
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    vatRate: vatRate || 0.0,
    vatRateText: (vatRate && `${vatRate}`) || "0"
  };
}

const bookings = [
  {
    id: "29576b51-3e17-4c1f-b912-b7ff1ded7077",
    received: addDays(new Date(), -60),
    source: "Word of mouth",
    title: "Art Exhibition",
    venue: "gallery",
    space: "lounge",
    status: "Proposal",
    customer: "opgreat",
    owner: owners[0],
    slots: [
      {
        kind: "multi-day",
        dateRange: [new Date(), addDays(new Date(), 1)],
        startHour: 9,
        startMinute: 0,
        endHour: 18,
        endMinute: 0
      }
    ],
    quotes: [],
    invoices: [
      {
        number: 1,
        created: new addDays(Date(), -20),
        amount: 300,
        paymentMethod: "Online Payment",
        status: "Unpaid",
        discount: 0,
        costItems: [
          {
            name: "Food & Beverages",
            description: "",
            quantity: 1,
            unitPrice: 300,
            vatRate: 0,
            vatRateText: "18"
          }
        ],
        slots: [
          {
            kind: "single-day",
            date: addDays(new Date(), -1),
            startHour: 15,
            startMinute: 0,
            endHour: 17,
            endMinute: 0
          }
        ]
      },
      {
        number: 2,
        created: new addDays(Date(), -10),
        amount: 1000,
        paymentMethod: "Online Payment",
        status: "Unpaid",
        discount: 0,
        costItems: [
          {
            name: "Venue Hire",
            description: "",
            quantity: 1,
            unitPrice: 1000,
            vatRate: 0,
            vatRateText: "18"
          }
        ],
        slots: [
          {
            kind: "single-day",
            date: addDays(new Date(), -1),
            startHour: 15,
            startMinute: 0,
            endHour: 17,
            endMinute: 0
          }
        ]
      }
    ]
  },
  {
    id: "99af5d47-3837-4623-be55-f85c0b511c0f",
    received: addDays(new Date(), -10),
    source: "Email",
    title: "CrossFit Class",
    venue: "gym",
    space: "func",
    status: "Paid",
    customer: "super",
    owner: owners[0],
    paymentMethod: "Online Payment",
    slots: [
      {
        kind: "single-day",
        date: addDays(new Date(), -1),
        startHour: 15,
        startMinute: 0,
        endHour: 17,
        endMinute: 0
      }
    ],
    quotes: [
      {
        created: new Date(),
        value: 1200,
        discount: 0,
        slots: [
          {
            kind: "single-day",
            date: addDays(new Date(), -1),
            startHour: 15,
            startMinute: 0,
            endHour: 17,
            endMinute: 0
          }
        ],
        notes:
          "The price includes the venue hire and beverages. I also added a discount because I like you.",
        costItems: [
          {
            name: "Venue Hire",
            description: "",
            quantity: 1,
            unitPrice: 1000,
            vatRate: 18,
            vatRateText: "18"
          },
          {
            name: "Drinks for after class",
            description: "",
            quantity: 1,
            unitPrice: 200,
            vatRate: 18,
            vatRateText: "18"
          }
        ]
      }
    ],
    invoices: [
      {
        number: 3,
        created: new addDays(Date(), -3),
        amount: 3000,
        paymentMethod: "Online Payment",
        status: "Paid",
        discount: 0,
        slots: [
          {
            kind: "single-day",
            date: addDays(new Date(), -1),
            startHour: 15,
            startMinute: 0,
            endHour: 17,
            endMinute: 0
          }
        ],
        costItems: [
          {
            name: "Venue Hire",
            description: "",
            quantity: 1,
            unitPrice: 1000,
            vatRate: 18,
            vatRateText: "18"
          },
          {
            name: "Drinks for after class",
            description: "",
            quantity: 1,
            unitPrice: 200,
            vatRate: 18,
            vatRateText: "18"
          }
        ]
      }
    ]
  },
  {
    id: "5bc16979-f56b-405b-82bb-839f3b018200",
    received: addDays(new Date(), -10),
    source: "Email",
    title: "Soccer Match",
    venue: "soccer",
    space: "field1",
    status: "Accepted",
    customer: "super",
    owner: owners[1],
    slots: [
      {
        kind: "single-day",
        date: addDays(new Date(), -1),
        startHour: 16,
        startMinute: 0,
        endHour: 18,
        endMinute: 0
      }
    ],
    quotes: [],
    invoices: []
  }
];

export {
  createEmptyBooking,
  createEmptyCostItem,
  createEmptyQuote,
  createEmptyInvoice,
  convertQuoteToInvoice,
  bookings
};
