import axios from 'axios';
import React, { useEffect, useContext } from 'react';
import { AppReducerContext } from '../contexts/AppReducerContext';
import CONFIG from './../config';
import { STRIPE_CONNECTION_SUCCESS } from '../reducers/actionType';

const CreateStripeAccount = (props) => {

    const { state, dispatch } = useContext(AppReducerContext);

    useEffect(() => {
        let locQueryObj = props.location.search;
        let code = locQueryObj.substring(6);
        if (code) {
            let req = {
                stripe_auth_code: code,
            }
            axios.post(
                '/bookings/setStripeAccountInfo', req
            ).then(function (res) {
                console.log(res);
                dispatch({
                    type: STRIPE_CONNECTION_SUCCESS,
                    payload: 1,
                })
                debugger;
                console.log("***********");
                console.log(CONFIG.REACT_APP_API_URL);
                console.log(CONFIG.STRIPE_CONNECT_CALLBACK_URL);
                window.location.href = CONFIG.STRIPE_CONNECT_CALLBACK_URL;
            });
        }
    }, [])

    return (
        <div className="job-search-card under-construction">
            <div className="text-center"></div>
        </div>
    )
}

export default CreateStripeAccount;

