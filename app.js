const express = require('express');
const app = express();
const userRout = require('./routers/usersRout');
const apiRout = require('./routers/apiRout');
app.use(express.json());
const { tokenValidateFunc } = require('./controller/users');
const serverApis = [
  { method: 'post', path: '/users/register', description: 'Register, Required: email, name, password', example: { body: { email: 'user@email.com', name: 'user', password: 'password' } } },
  { method: 'post', path: '/users/login', description: 'Login, Required: valid email and password', example: { body: { email: 'user@email.com', password: 'password' } } },
  { method: 'post', path: '/users/token', description: 'Renew access token, Required: valid refresh token', example: { headers: { token: '*Refresh Token*' } } },
  { method: 'post', path: '/users/tokenValidate', description: 'Access Token Validation, Required: valid access token', example: { headers: { Authorization: 'Bearer *Access Token*' } } },
  { method: 'get', path: '/api/v1/information', description: "Access user's information, Required: valid access token", example: { headers: { Authorization: 'Bearer *Access Token*' } } },
  { method: 'post', path: '/users/logout', description: 'Logout, Required: access token', example: { body: { token: '*Refresh Token*' } } },
  { method: 'get', path: 'api/v1/users', description: 'Get users DB, Required: Valid access token of admin user', example: { headers: { authorization: 'Bearer *Access Token*' } } },
];
app.use('/users', userRout);
app.use('/api', apiRout);

app.options('/', tokenValidateFunc, (req, res) => {
  res.header({ Allow: 'OPTIONS, GET, POST' }).send(serverApis);
});

module.exports = app;
