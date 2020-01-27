import React from "react";
import {
  StripeProvider,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  Elements,
  injectStripe,
} from "react-stripe-elements";
import styled from "styled-components";
import axios from "axios";

const handleBlur = () => {
  console.log("[blur]");
};

const handleChange = (change) => {
  console.log("[change]", change);
};

// const handleClick = () => {
//   console.log("[click]");
// };

const handleFocus = () => {
  console.log("[focus]");
};

const handleReady = () => {
  console.log("[ready]");
};

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: "#424770",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding,
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };
};

const StyledLabel = styled.label`
  font-size: 0.82em;
  font-weight: 500;
  line-height: 1.55;
  color: #93989F;
  margin-top: 1.4rem;
  display: block;
`;

const StyledButton = styled.button`
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 1em;
  text-align: center;
  border: 1px solid #E6E8E9;
  border-radius: 0.25em;
  height: 34px;
  padding: 0 0.7em;
  width: auto;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  background: #ffffff;
  color: #93989F;
  box-shadow: 0px 1.5px 1px rgba(0,0,0,0.05);
  border-color: #E92579;
  background: #E92579;
  box-shadow: 0px 2px 2px rgba(202,97,142,0.3);
  cursor: pointer;
  outline: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-animation: 1s 0.3s linear infinite;
  animation: 1s 0.3s linear infinite;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  color: white;
  margin-top: 1.4rem;

  &:active {
    opacity: 0.8;
  }

  input {
    display: block;
    margin: 10px 0 20px 0;
    max-width: 500px;
    padding: 10px 14px;
    font-size: 1em;
    font-family: "Source Code Pro", monospace;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border: 0;
    outline: 0;
    border-radius: 4px;
    background: white;

    &:focus {
      box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
      -webkit-transition: all 150ms ease;
      transition: all 150ms ease;
    }
  }
`;

class _SplitForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    let vm = this;
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((res) =>
          {
            let payload = {};
            payload.stripeToken = res.token;
            payload.amount = parseInt(vm.props.chargeData.amount);
            payload.currency = vm.props.chargeData.currency;
            payload.id = vm.props.chargeData.id;
            axios.post("/stripe/transferCardFunds", payload).then(
              resCharge => {
                this.props.closeModal();
              }
            )
          }
        );
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <StyledLabel>
          Card number
          <CardNumberElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </StyledLabel>
        <StyledLabel>
          Expiration date
          <CardExpiryElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </StyledLabel>
        <StyledLabel>
          CVC
          <CardCVCElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </StyledLabel>
        <StyledButton>
          Pay With Credit Card
        </StyledButton>
      </form>
    );
  }
}
const SplitForm = injectStripe(_SplitForm);

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elementFontSize: window.innerWidth < 450 ? "14px" : "18px",
    };
    window.addEventListener("resize", () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== "14px") {
        this.setState({elementFontSize: "14px"});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== "18px"
      ) {
        this.setState({elementFontSize: "18px"});
      }
    });
  }

  render() {
    const {elementFontSize} = this.state;
    return (
      <div className="Checkout" style={{width: "100%"}}>
        <Elements>
          <SplitForm
            fontSize={elementFontSize}
            chargeData={this.props.chargeData}
            closeModal={this.props.closeModal}
          />
        </Elements>
      </div>
    );
  }
}

const StripeApp = ({stripe_pk_key, chargeData, closeModal}) => {
  return (
    <StripeProvider apiKey={stripe_pk_key}>
      <Checkout chargeData={chargeData} closeModal={closeModal}/>
    </StripeProvider>
  );
};

export default StripeApp;
