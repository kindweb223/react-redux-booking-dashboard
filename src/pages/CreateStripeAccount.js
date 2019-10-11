import axios from 'axios';
import React from 'react';


export default class CreateStripeAccount extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let locQueryObj = this.props.location.search;
        let code = locQueryObj.substring(6);
        if (code) {
            let req = {
                stripe_auth_code: code,
            }
            axios.post(
                '/bookings/setStripeAccountInfo', req
            ).then(function (res) {
                console.log(res);
                window.location.href = 'http://localhost:3000/settings';
            });
        }
    }

    render() {
        return (
            <div className="job-search-card under-construction">
                <div className="text-center"></div>
            </div>
        );
    }
}
