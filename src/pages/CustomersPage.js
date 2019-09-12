import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
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
import SpinnerContainer from "../components/layout/Spinner";

import {
  REQUEST_GET_CUSTOMERS,
  GET_CUSTOMERS_SUCCESS,
  GET_CUSTOMERS_ERROR,
  REQUEST_ADD_CUSTOMER,
  GET_ADD_CUSTOMER_SUCCESS,
  GET_ADD_CUSTOMER_ERROR,
  REQUEST_UPDATE_CUSTOMER,
  GET_UPDATE_CUSTOMER_SUCCESS,
  GET_UPDATE_CUSTOMER_ERROR,
  REQUEST_DELETE_CUSTOMER,
  GET_DELETE_CUSTOMER_SUCCESS,
  GET_DELETE_CUSTOMER_ERROR,
} from "../reducers/actionType";

const CustomersPage = () => {
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { state, dispatch } = useContext(AppReducerContext);
  const searchResults =
    searchQuery.length > 0
      ? state.customers.customers.filter(customer =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : state.customers.customers;

  useEffect(() => {
    const getCustomers = async () => {
      try {
        dispatch({ type: REQUEST_GET_CUSTOMERS });

        const res = await axios.get('/customers');

        dispatch({
          type: GET_CUSTOMERS_SUCCESS,
          payload: res.data.customers
        })
      } catch (err) {
        dispatch({ type: GET_CUSTOMERS_ERROR });
      }
    }
    getCustomers();
  }, []);

  const onEditCustomer = async (customer) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (customer.id === -1) {
      setShowCreateClientModal(false);
      try {
        dispatch({ type: REQUEST_ADD_CUSTOMER })

        delete customer.id;
        const res = await axios.post('/customers', JSON.stringify(customer), config);

        dispatch({
          type: GET_ADD_CUSTOMER_SUCCESS,
          payload: res.data.customer,
        })
      } catch (err) {
        dispatch({ type: GET_ADD_CUSTOMER_ERROR });
      }
    } else {
      try {
        dispatch({ type: REQUEST_UPDATE_CUSTOMER });

        const res = await axios.put(`/customers/${customer.id}`, JSON.stringify(customer), config);

        dispatch({
          type: GET_UPDATE_CUSTOMER_SUCCESS,
          payload: res.data.customer,
        })
      } catch (err) {
        dispatch({ type: GET_UPDATE_CUSTOMER_ERROR });
      }
    }
  }

  const handleClickDelete = async (id) => {
    dispatch({ type: REQUEST_DELETE_CUSTOMER })

    try {

      const res = await axios.delete(`/customers/${id}`);

      dispatch({
        type: GET_DELETE_CUSTOMER_SUCCESS,
        payload: id
      })
    } catch (err) {
      dispatch({ type: GET_DELETE_CUSTOMER_ERROR })
    }
  }

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
        <SpinnerContainer loading={((searchResults && searchResults.length <= 0) && state.customers.loadingCustomers).toString()} />
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
                <TableValue>{customer.phone || "N/A"}</TableValue>
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
                    handleClickDelete(customer.id)
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
          customer={state.customers.customers.find(c => c.id === selectedClientId)}
          onEndEditing={(customer) => {onEditCustomer(customer)}}
        />
      </Modal>

      <Modal
        isOpen={showCreateClientModal}
        onClose={() => setShowCreateClientModal(false)}
      >
        <CustomerDetailEdit
          onEndEditing={customer => {
            onEditCustomer(customer);
          }}
        />
      </Modal>
    </>
  );
};

export default CustomersPage;
