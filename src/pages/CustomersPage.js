import React, { useState, useContext } from "react";
import Modal from "../components/modals/modal";
import { Table, TableValue } from "../components/tables/tables";
import AddGlyph from "../images/Glyphs/AddGlyph";
import SvgButton from "../components/buttons/SvgButton";
import colors from "../components/style/colors";
import viewGlyph from "../images/Glyphs/view.svg";
import CustomerDetail from "../components/features/customerDetail";
import Button from "../components/buttons/Button";
import CustomerDetailEdit from "../components/features/customerDetailEdit";
import DropdownMenu from "../components/buttons/DropdownMenu";
import { AppReducerContext } from "../contexts/AppReducerContext";
import { css } from "emotion";
import SearchField from "../components/inputs/searchField";
import P1 from "../components/typography/P1";

const CustomersPage = () => {
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { state, dispatch } = useContext(AppReducerContext);

  const searchResults =
    searchQuery.length > 0
      ? state.customers.filter(customer =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : state.customers;

  return (
    <>
      <div
        className={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          margin-bottom: 40px;
        `}
      >
        <SearchField
          query={searchQuery}
          placeholder={"Search Customers"}
          onChange={e => setSearchQuery(e.target.value)}
          onEnterKeyPress={() =>
            searchResults.length === 1 &&
            setSelectedClientId(searchResults[0].id)
          }
        />
        <Button
          primary
          onClick={() => setShowCreateClientModal(!showCreateClientModal)}
          iconComponent={() => <AddGlyph fill={colors.white} />}
          className={css``}
        >
          Add Customer
        </Button>
      </div>

      {searchResults && searchResults.length > 0 && (
        <Table
          columns="1fr 1fr 1fr 50px 50px"
          columnTitles={["Name", "Email", "Phone", "", ""]}
        >
          {searchResults.map((customer, index) => {
            return (
              <React.Fragment key={index}>
                <TableValue>{customer.name}</TableValue>
                <TableValue>{customer.email || "N/A"}</TableValue>
                <TableValue>{customer.phoneNumber || "N/A"}</TableValue>
                <SvgButton
                  width={24}
                  height={24}
                  svg={viewGlyph}
                  onClick={() => setSelectedClientId(customer.id)}
                />
                <DropdownMenu
                  items={["Delete"]}
                  colors={["#D13636"]}
                  onItemSelected={item => {
                    dispatch({ type: "delete_customer", id: customer.id });
                  }}
                />
              </React.Fragment>
            );
          })}
        </Table>
      )}

      {searchResults.length === 0 && (
        <P1>
          There are no customers matching your search.{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setSearchQuery("")}
          >
            View All
          </span>
        </P1>
      )}

      <Modal
        isOpen={selectedClientId !== null}
        onClose={() => setSelectedClientId(null)}
      >
        <CustomerDetail
          customer={state.customers.find(c => c.id === selectedClientId)}
          onEndEditing={() => setSelectedClientId(null)}
        />
      </Modal>

      <Modal
        isOpen={showCreateClientModal}
        onClose={() => setShowCreateClientModal(false)}
      >
        <CustomerDetailEdit
          onEndEditing={customer => {
            dispatch({ type: "append_customer", customer });
            setShowCreateClientModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default CustomersPage;
