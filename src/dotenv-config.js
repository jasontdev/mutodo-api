// if NODE_ENV is defined then append then appropriate .env file
require('dotenv').config({
  path: `.env${process.env.NODE_ENV ? '.'.concat(process.env.NODE_ENV) : ''}`
});
