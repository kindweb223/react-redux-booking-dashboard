require ('dotenv').config();

let CONFIG = {};

CONFIG.BASE_URL                                 = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
CONFIG.API_URL                                  = process.env.REACT_APP_API_URL || 'http://localhost:3001/v1';
CONFIG.STRIPE_CONNECT_CALLBACK_URL              = process.env.REACT_APP_STRIPE_CONNECT_CALLBACK_URL || '';
CONFIG.SENTRY_DSN                               = process.env.REACT_APP_SENTRY_DSN || '';
CONFIG.STRIPE_CLIENT_PUBLIC_KEY                 = process.env.STRIPE_CLIENT_PUBLIC_KEY || 'pk_test_WzBWalkASwZyPFaA0dJhOZ1p00bXlkON04'; 

module.exports = CONFIG;