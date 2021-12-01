const express = require('express');
const app = express();
const userRout = require('./routers/usersRout');
const apiRout = require('./routers/apiRout');
app.use(express.json());

app.use('/users', userRout);
app.use('/api', apiRout);

module.exports = app;
