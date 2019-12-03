const express = require('express');
const cors = require('cors');
const app = express();

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(cors());
// Can pass options 
app.use(express.json());

