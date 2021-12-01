const express = require('express');
const app = express();
const userRout = require('./routers/usersRout');
app.use(express.json());

app.use('/users', userRout);

module.exports = app;
