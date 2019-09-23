require ('dotenv').config();

let CONFIG = {};

CONFIG.API_URL = process.env.API_URL || 'http://localhost:3001/v1';

module.exports = CONFIG;