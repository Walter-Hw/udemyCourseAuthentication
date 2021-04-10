const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  ID: process.env.ATLAS_ID,
  KEY: process.env.ATLAS_KEY
};