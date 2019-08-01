import React, { useState } from "react";
import styled from "styled-components";
import H3 from "../typography/H3";
import Button from "../buttons/Button";
import Grid from "../layout/Grid";
import { TableItem } from "../tables/tables";
import CustomerDetailEdit from "./customerDetailEdit";
import {
  ModalContainer,
  ModalTopSection,
  ModalTitleAndButtons,
  ModalBottomSection
} from "../modals/containers";

const BottomSectionWrapper = styled.div`
  width: 100%;
  padding: 20px 20px 15px;
  overflow: scroll;
`;

const CustomerDetail = props => {
  const { customer } = props;

  const [editing, setEditing] = useState(false);

  if (!customer) {
    return null;
  }

  if (editing) {
    return (
      <CustomerDetailEdit
        customer={customer}
        onEndEditing={() => setEditing(false)}
      />
    );
  }

  return (
    <ModalContainer>
      <ModalTopSection>
        <ModalTitleAndButtons>
          <H3 style={{ margin: 0 }}>{customer.name}</H3>
          <div>
            <Button
              primary
              style={{ marginRight: 10 }}
              onClick={() => setEditing(!editing)}
            >
              Edit
            </Button>
          </div>
        </ModalTitleAndButtons>
      </ModalTopSection>

      <ModalBottomSection>
        <BottomSectionWrapper>
          <Grid columns="1fr 1fr">
            <TableItem
              label={"Phone Number"}
              value={customer.phoneNumber || "N/A"}
            />
            <TableItem label={"Email"} value={customer.email || "N/A"} />
            <TableItem label={"Address"} value={customer.address || "N/A"} />
            <TableItem
              label={"VAT Number"}
              value={customer.vatNumber || "N/A"}
            />
          </Grid>
          {customer.notes && (
            <Grid columns="1fr" style={{ marginTop: "1em" }}>
              <TableItem
                label={"Private Notes"}
                value={customer.notes || "N/A"}
              />
            </Grid>
          )}
        </BottomSectionWrapper>
      </ModalBottomSection>
    </ModalContainer>
  );
};

export default CustomerDetail;
