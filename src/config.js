require ('dotenv').config();

let CONFIG = {};

CONFIG.BASE_URL                                 = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
CONFIG.API_URL                                  = process.env.REACT_APP_API_URL || 'http://localhost:3001/v1';
CONFIG.STRIPE_CONNECT_CALLBACK_URL              = process.env.REACT_APP_STRIPE_CONNECT_CALLBACK_URL || '';
CONFIG.SENTRY_DSN                               = process.env.REACT_APP_SENTRY_DSN || '';

module.exports = CONFIG;