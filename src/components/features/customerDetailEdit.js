import React, { useReducer, useState } from "react";
import styled from "styled-components";
import { css } from "emotion";
import H3 from "../typography/H3";
import Button from "../buttons/Button";
import Grid from "../layout/Grid";
import { TableEditableValue } from "../tables/tables";
import { createEmptyCustomer } from "../../models/customers";
import {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
} from "../modals/containers";

const Spacer = styled.div`
  flex: 1 0 1.5em;
`;

const CustomerDetailEdit = props => {  

  const { customer: customerToEdit, onEndEditing } = props;
  const isEditing = customerToEdit !== null;

  const [customer, dispatch] = useReducer(
    reducer,
    customerToEdit || createEmptyCustomer()
  );

  const [ isNameValidate, setIsNameValidate ] = useState(true);
  
  const handleChangeName = value => {
    if (value.length === 0)
      setIsNameValidate(false);
    else setIsNameValidate(true);
    dispatch({ type: "set_value", key: "name", value: value })
  }

  const handleClickSave = () => {
    if (customer.name.length === 0) {
      setIsNameValidate(false);
      return;
    }
    onEndEditing(customer, true);
  }

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>{customer.name || "New Customer"}</H3>
          <div>
            {isEditing && (
              <Button style={{ marginRight: 10 }} onClick={e => onEndEditing(null, false)}>
                Cancel
              </Button>
            )}
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={handleClickSave}
              disabled={!isNameValidate}
            >
              {isEditing ? "Save" : "Create Customer"}
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        <>
          <TableEditableValue
            label="Name"
            value={customer.name}
            onChange={value =>
              handleChangeName(value)
            }
            style={{ width: "100%" }}
            className={(!isNameValidate? "error" : "")}
          />
          {
            !isNameValidate && 
            <p 
              className={
                css`
                  color: #E92579;            
                  margin: 0.2em 0 0 0;
                  padding: 0 0.6em;
                  font-size: 0.8em;
                `
              }
            >
              Company Name is required.
            </p>
          }   
          <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 10 }}>
            <TableEditableValue
              label="Phone Number"
              value={customer.phone}
              onChange={value =>
                dispatch({
                  type: "set_value",
                  key: "phone",
                  value: value
                })
              }
              style={{ width: "100%" }}
            />

            <TableEditableValue
              label="Email"
              value={customer.email}
              onChange={value =>
                dispatch({ type: "set_value", key: "email", value: value })
              }
            />

            <TableEditableValue
              label="Address"
              value={customer.address}
              onChange={value =>
                dispatch({ type: "set_value", key: "address", value: value })
              }
            />

            <TableEditableValue
              label="VAT Number"
              value={customer.vatNumber}
              onChange={value =>
                dispatch({
                  type: "set_value",
                  key: "vatNumber",
                  value: value
                })
              }
            />
          </Grid>

          <TableEditableValue
            label="Private Notes"
            value={customer.note}
            longText
            style={{
              width: "100%",
              marginTop: "0.8em",
              height: 80
            }}
            onChange={value =>
              dispatch({ type: "set_value", key: "note", value: value })
            }
          />
        </>
        <Spacer />
      </ModalBottomSection>
    </ModalContainer>
  );
};

function reducer(state, action) {
  switch (action.type) {
    case "set_value":
      return {
        ...state,
        [action.key]: action.value
      };

    default:
      throw new Error();
  }
}

export default CustomerDetailEdit;
