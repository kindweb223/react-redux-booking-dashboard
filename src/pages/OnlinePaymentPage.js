import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import styled from "styled-components";
import { TableEditableValue } from "../components/tables/tables";
import AddGlyph from "../images/Glyphs/AddGlyph";
import SvgButton from "../components/buttons/SvgButton";
import colors from "../components/style/colors";
import Grid from "../components/layout/Grid";
import Button from "../components/buttons/Button";
import { AppReducerContext } from "../contexts/AppReducerContext";
import { css } from "emotion";
import P2 from "../components/typography/P1";
import SpinnerContainer from "../components/layout/Spinner";

import {
	REQUEST_SAVE_PAYMENT_INFORMATION,
	SAVE_PAYMENT_INFORMATION_SUCCESS,
	SAVE_PAYMENT_INFORMATION_ERROR,
} from "../reducers/actionType";

const OnlinePaymentPage = () => {
	
	const StyledLink = styled.a`
		color: ${colors.accent_pink};
		text-decoration: none;
	`;

	const StyledBtnContainer = styled.div`
		display: flex;
		justify-content: flex-end;
		margin-top: 1em;
	`;
	
  const { state, dispatch } = useContext(AppReducerContext);
	const [ stripInformation, setStripInformation ] = useState({
		public_key: {value: "", validate: true},
		secret_key: {value: "", validate: true},
	})

	useEffect(() => {
		setStripInformation({
			public_key: {
				value: (state.auth.user.stripe_public_key) ? state.auth.user.stripe_public_key: "", 
				validate: (!state.auth.user.stripe_public_key || state.auth.user.stripe_public_key.length === 0) ? false : true,
			},
			secret_key: {
				value: state.auth.user.stripe_secret_key ? state.auth.user.stripe_secret_key :  "", 
				validate: (!state.auth.user.stripe_secret_key || state.auth.user.stripe_secret_key.length === 0) ? false : true,
			},
		})
	}, [state.auth.user.stripe_public_key, state.auth.user.stripe_secret_key])

  const savePaymentInformation = async () => {
    try {
			dispatch({ type: REQUEST_SAVE_PAYMENT_INFORMATION });

			const config = {
					headers: {
						'Content-Type': 'application/json'
					}
			};

			const res = await axios.put(
				'/users', 
				{
					stripe_public_key: stripInformation.public_key.value, 
					stripe_secret_key: stripInformation.secret_key.value,
				},
				config
			)
			
			
			dispatch({
				type: SAVE_PAYMENT_INFORMATION_SUCCESS,
				public_key: stripInformation.public_key.value,
				secret_key: stripInformation.secret_key.value,
			})
    } catch (err) {
			dispatch({ type: SAVE_PAYMENT_INFORMATION_ERROR })
    }
  }

  const changeStripInformation = (keyName, value) => {
		const newInfo = { ...stripInformation };
		newInfo[keyName].value = value;
		newInfo[keyName].validate = (value.length > 0)
		setStripInformation({
			...newInfo,
		})
  }

  return (
    <div>      			
			<SpinnerContainer loading={(state.auth.loading || state.auth.loadingPayment).toString()} />
			<P2>
				Use our live gateway with real payments
				To switch on live payments, enter your Stripe API keys below. We recommend Stripe for taking payments (no merchant account required). If you don't yet have a Stripe account, 
				<StyledLink href="https://stripe.com">  Sign up here.</StyledLink>
			</P2>
			<TableEditableValue
				label="Publishable Key"                
				value={stripInformation.public_key.value}
				onChange={value => {changeStripInformation('public_key', value)}}
				style={{marginTop: "2em"}}
			/>
			{
				!stripInformation.public_key.validate && 
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
					Strip Publishable Key is required.
				</p>
			}
			<TableEditableValue
				label="Secret Key"
				value={stripInformation.secret_key.value}
				onChange={value => {changeStripInformation('secret_key', value)}}			
				style={{marginTop: "1em"}}
			/>
			{
				!stripInformation.secret_key.validate && 
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
					Strip Secret Key is required.
				</p>
			}
			<StyledBtnContainer>
				<Button 
					primary 
					onClick={savePaymentInformation}
				>
					Save
				</Button>
			</StyledBtnContainer>
    </div>
  );
};

export default OnlinePaymentPage;
