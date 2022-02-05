// if NODE_ENV is defined then load corresponding .env file
// eg if NODE_ENV=production, load .env.production
require('dotenv').config({
  path: `.env${process.env.NODE_ENV ? '.'.concat(process.env.NODE_ENV) : ''}`
});
