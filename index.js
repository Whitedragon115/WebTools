const express = require('express');
const path = require('path');
require('dotenv').config();

const PORT = process.env.webport;

const {  } = require('./api/tmpfile-v1.0')
const web = require('./web/init.js')

web.start(PORT);

