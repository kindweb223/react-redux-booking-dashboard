const bookingStates = [
  { id: "enquiry", name: "Enquiry", color: "#EECB2D", type: "default" },
  {
    id: "d805fe0e-29bc-4aac-8c7c-44f7c6c2db93",
    name: "Checked by Jamie",
    type: "custom",
    enabled: true
  },
  { id: "proposal", name: "Proposal", color: "#F68F56", type: "default" },
  { id: "accepted", name: "Accepted", color: "#E92579", type: "default" },
  { id: "paid", name: "Paid", color: "#52DDC2", type: "default" }
];

const bookingStatesNames = bookingStates.map(s => s.name);
const bookingStatesColors = bookingStates.map(s => s.color);

export { bookingStates, bookingStatesNames, bookingStatesColors };
