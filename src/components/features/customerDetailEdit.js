import React, { useReducer } from "react";
import styled from "styled-components";
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

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>{customer.name || "New Customer"}</H3>
          <div>
            {isEditing && (
              <Button style={{ marginRight: 10 }} onClick={onEndEditing}>
                Cancel
              </Button>
            )}
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => onEndEditing(customer)}
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
              dispatch({ type: "set_value", key: "name", value: value })
            }
            style={{ width: "100%" }}
          />
          <Grid columns="1fr 1fr" style={{ width: "100%", marginTop: 10 }}>
            <TableEditableValue
              label="Phone Number"
              value={customer.phoneNumber}
              onChange={value =>
                dispatch({
                  type: "set_value",
                  key: "phoneNumber",
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
            value={customer.notes}
            longText
            style={{
              width: "100%",
              marginTop: "0.8em",
              height: 80
            }}
            onChange={value =>
              dispatch({ type: "set_value", key: "notes", value: value })
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
