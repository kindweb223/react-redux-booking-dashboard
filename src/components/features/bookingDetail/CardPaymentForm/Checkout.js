import React from "react"
import styled from "styled-components";
import { css } from "emotion";
import axios from "axios";
import { CardElement, injectStripe, Elements } from "react-stripe-elements";

import { formatCurrency } from '../../../../utils/numbers'

const CardPaymentForm = styled.form`
  background-color: #fff;
  width: 100%;
  transition-property: opacity, transform;
  transition-duration: 0.35s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);

  &.success {
    opacity: 0;
    transform: scale(0.9);
    pointer-events: none;
  }

  .StripeElement {
    width: 100%;
    padding: 11px 15px;
    background-color: #7a98f5;
    border-radius: 0.2em;  
  }

  .info-div {
    padding: 0;
    border-style: none;
    background-color: #7795f8;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #829fff;
    border-radius: 0.2em;
    margin-bottom: 1.25em;    
  }

  .submit-button {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    text-align: center;
    border: 1px solid #E6E8E9;
    border-radius: 0.25em;
    height: 34px;
    padding: 0 0.7em;
    flex: 0 0 auto;
    background: #ffffff;
    color: #93989F;
    box-shadow: 0px 1.5px 1px rgba(0,0,0,0.05);
    border-color: #E92579;
    background: #E92579;
    box-shadow: 0px 2px 2px rgba(202,97,142,0.3);
    cursor: pointer;
    outline: none;
    user-select: none;
    animation: 1s 0.3s linear infinite;
    animation-timing-function: ease-in-out;
    color: white;
    font-size: 0.9em;
    font-weight: 400;
    margin-top: 2.5em;
    &:active {
      opacity: 0.8;
    }
  }
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  border-top-color:rgb(129, 158, 252);
  border-top-style:solid;
  border-top-width:1px;
  &:first-child {
    border: none;
  }

  label {
    font-size: 0.95em;
    color: #95adf7;
    min-width: 60px;
    padding: 11px 0;    
  }

  input {
    font-size: 0.95em;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    padding: 11px 0;    
    width: 100%;
    border: none !important;
    &::placeholder {
      color: #88bafa;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      border: inherit;
      -webkit-text-fill-color: white;      
      transition: background-color 5000s ease-in-out 0s;
      font-size: 0.95em;
    }

  }
` 

const ErrMsgDiv = styled.div`
  display: flex;    
  justify-content: center;
  width: 100%;
  top: 100%;
  margin-top: 20px;
  left: 0;
  padding: 0 15px;
  font-size: 13px !important;
  opacity: 0;
  transform: translateY(10px);
  transition-property: opacity, transform;
  transition-duration: 0.35s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);

  &.visible {
    opacity: 1;
    transform: none;
  }

  svg {
    margin-right: 10px;
    .base {
      fill: #7a98f5;
    }
    .glyph {
      fill: white;
    }
  } 

  .message {
    color: #7a98f5;
  }
`

const SuccessDiv = styled.div`

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);    
  text-align: center;
  opacity: ${props => (props.isSuccess ? 1 : 0)};
  
  .icon {
    .border {
      stroke: #87bbfd;
      stroke-dasharray: 0;
    }
    .checkmark {
      stroke: #87bbfd;
      stroke-dasharray: 60;
      stroke-dashoffset: ${props => (props.isSuccess ? "0 !important" : "60")};
      transition: stroke-dashoffset 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) 0.35s;
    }
  }

  .title {
    color: #87bbfd;
  }

  .message {
    color: #87bbfd;
  }

  .reset {
    path {
      fill: #fff;
    }
  }
  
  &.submitting {
    .icon {
      .border {
        stroke-dasharray: 251;
        stroke-dashoffset: 62.75;
        transform-origin: 50% 50%;
        transition: stroke-dashoffset 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
        animation: spin 1s linear infinite;
      }
    }
  }
`

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class _CardForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isValidate: true,
      errMsg: "",
      success: false,
    }
  }

  changeCardElement = () => {
    this.setState({
      isValidate: true,
      errMsg: "",
    })
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    axios.post(
      '/bookings/createPaymentIntent',
      {
        payment_method_types: ["card"],
        amount: this.props.chargeData.amount * 100,
        currency: this.props.chargeData.currency,
        metadata: {
          name: ev.target[0].value,
          email: ev.target[1].value,
          tel: ev.target[2].value,
        }
      }
    )
      .then(res => {
        this.props.stripe.
          handleCardPayment(res.data.client_secret)
          .then(payload => {    
            debugger;        
            if (payload.error) {
              this.setState({
                isValidate: false,
                processing: false,
                errMsg: payload.error.message
              })
            } else {
              this.setState({
                isValidate: true,
                processing: false,
                errMsg: "",
                success: true,
              })
            }
          }
        )  
      }
    )
  };

  render() {
    return (
      <React.Fragment>
        <CardPaymentForm 
          onSubmit={this.handleSubmit} 
          isSuccss={this.state.success}
          className={this.state.success ? "success" : ""}
        >        
          <div className="info-div">
            <InputRow>
              <label>Name</label>
              <input type="text" placeholder="Jane Doe" required={true} autocomplete="name" name="name" />
            </InputRow>
            <InputRow>
              <label>Email</label>
              <input type="email" placeholder="janedoe@gmail.com" required={true} autocomplete="email" name="email" />
            </InputRow>
            <InputRow>
              <label>Phone</label>
              <input type="tel" placeholder="(941) 555-0123" required={true} autocomplete="tel" name="tel" />
            </InputRow>
          </div>

          <CardElement
            hidePostalCode={true} 
            iconStyle={'solid'}
            onChange={this.changeCardElement}
            style={{              
              base: {
                iconColor: '#c4f0ff',
                color: '#fff',
                fontWeight: 500,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
        
                ':-webkit-autofill': {
                  color: '#fce883',
                },
                '::placeholder': {
                  color: '#87BBFD',
                },
              },
              invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
              },              
            }}
          />
          <button className="submit-button">        
            {"Pay " + formatCurrency(this.props.chargeData.amount, this.props.chargeData.currency)}
          </button>

          <ErrMsgDiv className={!this.state.isValidate ? "visible" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
              <path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
              <path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
            </svg>
            <span className="message">{this.state.errMsg}</span>
          </ErrMsgDiv>

        </CardPaymentForm>

        <SuccessDiv isSuccess={this.state.success}>
          <div className="icon">
            <svg 
              width="84px" height="84px" 
              viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <circle 
                className="border" cx="42" cy="42" r="40" 
                strokeLinecap="round" strokeWidth="4" stroke="#000" fill="none"></circle>
              <path 
                className="checkmark" 
                strokeLinecap="round" strokeLinejoin="round" 
                d="M23.375 42.5488281 36.8840688 56.0578969 64.891932 28.0500338" 
                strokeWidth="4" stroke="#000" fill="none">                  
              </path>
            </svg>
          </div>
          <h3 
            className="title">
            Payment successful
          </h3>              
        </SuccessDiv>
      </React.Fragment>
    );
  }
}
const CardForm = injectStripe(_CardForm);

const CheckoutDiv = styled.div`
  background-color: #fff;
  width: 75%;
  margin: 0.5em auto;
  padding: 4em 2em 2em;
  position: relative;
`;

class Checkout extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
    };
    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

  render() {
    const { chargeData } = this.props;
    return (
      <CheckoutDiv>
        <Elements>
          <CardForm chargeData={chargeData} />
        </Elements>
      </CheckoutDiv>
    );
  }
}

export default Checkout;