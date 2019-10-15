import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { 
	TableEditableValue,
	TableDivider,
} from "../components/tables/tables";
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

	const StyledInputDiv = styled.div``;

	const StyledBtnContainer = styled.div`
		display: flex;
		justify-content: flex-start;
		margin-top: 1em;
	`;

	const StyledLabel = styled.label`
		font-size: 0.82em;
    font-weight: 500;
    line-height: 1.55;
    color: #93989F;
		margin-bottom: 0.3em;
		display: flex;
		align-item: center;
	`;

	const IconSpan = styled.span`
		width: 16px;
		height: 16px;
		justify-content: center;
		align-items: center;
		border: 1px solid #93989F;
		border-radius: 10px;
		margin-left: 18px;
		display: flex;
		cursor: pointer;
		.fa-icons {
			font-size: 10px;
		}
	`;

	const { state, dispatch } = useContext(AppReducerContext);
	const [stripInformation, setStripInformation] = useState({
		public_key: { value: "", validate: true },
		secret_key: { value: "", validate: true },
	})

	useEffect(() => {
		setStripInformation({
			public_key: {
				value: (state.auth.user.stripe_public_key) ? state.auth.user.stripe_public_key : "",
				validate: (!state.auth.user.stripe_public_key || state.auth.user.stripe_public_key.length === 0) ? false : true,
			},
			secret_key: {
				value: state.auth.user.stripe_secret_key ? state.auth.user.stripe_secret_key : "",
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

	const testCreatePaymentInformation = async () => {
		try {
			dispatch({ type: REQUEST_SAVE_PAYMENT_INFORMATION });
			const config = {
				headers: {
					'Content-Type': 'application/json'
				}
			};
			const res = await axios.post(
				'/bookings/getCreateStripeAccountLink',
			).then(function (res) {
				console.log(res.data.url);
				window.location.href = res.data.url;
			});
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

			<StyledInputDiv style={{ marginTop: "2em" }}>
				<StyledLabel>
					PUBLISHABLE KEY
					<IconSpan>
						<FontAwesomeIcon className="fa-icons" icon={faExclamation} />
					</IconSpan>
				</StyledLabel>
				<TableEditableValue
					label=""
					value={stripInformation.public_key.value}
					onChange={value => { changeStripInformation('public_key', value) }}
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
			</StyledInputDiv>
			<StyledInputDiv style={{ marginTop: '1.4em' }}>
				<StyledLabel>
					SECRET KEY
					<IconSpan>
						<FontAwesomeIcon className="fa-icons" icon={faExclamation} />
					</IconSpan>
				</StyledLabel>
				<TableEditableValue
					label=""
					value={stripInformation.secret_key.value}
					onChange={value => { changeStripInformation('secret_key', value) }}
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
			</StyledInputDiv>
			
			<StyledBtnContainer>
				<Button
					primary
					onClick={savePaymentInformation}
				>
					Save
				</Button>
			</StyledBtnContainer>

			<TableDivider />
			
			{state.auth.user.stripe_status === 0 ? (
					<P2>
						If you have a Stripe Account, please connect your Stripe Account to the Server.
						After Stripe Account connection, You can pay your invoice to the server with Online Payment Methond.
					</P2>
				) : (
					<P2>
						Your Stripe Account has been already connected to the Server.
						You can pay your invoice to the Server with Online Payment Method.
					</P2>
				)
			}			

			<StyledBtnContainer>
				<Button
					primary
					onClick={testCreatePaymentInformation}					
					disabled={state.auth.user.stripe_status != 0}
				>
					Connect Your Stripe
				</Button>
			</StyledBtnContainer>
		</div >
	);
};

export default OnlinePaymentPage;
