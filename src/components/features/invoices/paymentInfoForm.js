import React, { useState } from "react";
import styled from "styled-components";
import { TableSectionHeader, TableEditableValue, Table } from "../../tables/tables";


const FormWrapper = styled.div`
  width: 100%;
`;

const PaymentInfoForm = props => {
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState(0);
  const [expDay, setExpDay] = useState(0);
  const [cvc, setCVC] = useState('');

  const { payment_method } = props;

  return (
      <div className="payment">
        {
          payment_method && payment_method === 'Credit Card' ?
          <div className="payment-form">
              <TableSectionHeader title={"Payment Info"} />
              <Table>
                <TableEditableValue
                  placeholder="Card Number"
                  tabindex="1"
                  onChange={value => setCardNumber(value)}
                />
                <TableEditableValue
                  placeholder="Expiration Month"
                  tabindex="2"
                  type="number"
                  onChange={value => setExpMonth(value)}
                />
                <TableEditableValue
                  placeholder="Expiration Day"
                  tabindex="3"
                  type="number"
                  onChange={value => setExpDay(value)}
                />
                <TableEditableValue
                  placeholder="CVC"
                  tabindex="4"
                  onChange={value => setCVC(value)}
                />
              </Table>
            </div>
            :
            null
        }
      </div>
    );
};

export default PaymentInfoForm;
