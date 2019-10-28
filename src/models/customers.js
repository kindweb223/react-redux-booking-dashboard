// import uuidV4 from "../utils/uuidV4";
// id, name, address, phone, email, notes, vat number
function createEmptyCustomer() {
  return {
    // id: uuidV4(),
    id: -1,
    name: "",
    address: "",
    phone: "",
    email: "",
    note: "",
    vatNumber: ""
  };
}

const customers = [
  {
    id: "fd",
    name: "Francesco Di Lorenzo",
    address: "Milano, Italy",
    phoneNumber: "+393456787654",
    email: "francesco@superlinear.co",
    notes: "Co-founder and developer at Superlinear",
    vatNumber: ""
  },
  {
    id: "opgreat",
    name: "Operational Greatness Ltd",
    address: "66 Finella terrace, Fintry, Dundee, DD4 9NZ, UK",
    phoneNumber: null,
    email: null,
    notes: "",
    vatNumber: "GB232316249"
  },
  {
    id: "super",
    name: "Superlinear Srl",
    address: "Via Paolo da Cannobio 9, Milan, Italy",
    phoneNumber: null,
    email: "hello@superlinear.co",
    notes: "Rented a venue once, said they would rent again in May",
    vatNumber: "IT10540450961"
  }
];

export { customers, createEmptyCustomer };
