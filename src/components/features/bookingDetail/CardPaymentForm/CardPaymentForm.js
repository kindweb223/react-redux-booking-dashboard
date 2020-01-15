import React from "react"
import { StripeProvider } from "react-stripe-elements"
import Checkout from './Checkout'

import { TableSectionHeader } from '../../../tables/Tables'
import CONFIG from '../../../../config'

const CardPaymentForm = ({
  chargeData
}) => {
  return (
    <React.Fragment>
      <TableSectionHeader title={"Your Details"} />
      <div style={{ width: '100%'}}>
        <StripeProvider apiKey={CONFIG.STRIPE_CLIENT_PUBLIC_KEY}>
          <Checkout chargeData={chargeData} />
        </StripeProvider>      
      </div>
    </React.Fragment>
  )
}

export default CardPaymentForm