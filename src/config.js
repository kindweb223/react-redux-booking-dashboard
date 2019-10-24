require ('dotenv').config();

let CONFIG = {};
// process.env.STRIPE_CONNECT_CALLBACK_URL: https://app.heyagenda.com/settings
CONFIG.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/v1';
CONFIG.STRIPE_CONNECT_CALLBACK_URL = process.env.STRIPE_CONNECT_CALLBACK_URL || 'https://app.heyagenda.com/settings'
module.exports = CONFIG;