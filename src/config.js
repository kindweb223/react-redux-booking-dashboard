require ('dotenv').config();

let CONFIG = {};

CONFIG.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/v1';

module.exports = CONFIG;