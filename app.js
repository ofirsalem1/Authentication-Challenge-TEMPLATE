const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userRout = require('./routers/usersRout');
const apiRout = require('./routers/apiRout');
app.use(express.json());
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

app.options('/', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.header({ Allow: 'OPTIONS, GET, POST' }).send([serverApis[0], serverApis[1]]);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.header({ Allow: 'OPTIONS, GET, POST' }).send([serverApis[0], serverApis[1], serverApis[2]]);
    }
    if (user.isAdmin) {
      return res.header({ Allow: 'OPTIONS, GET, POST' }).send(serverApis);
    }
    return res.header({ Allow: 'OPTIONS, GET, POST' }).send([serverApis[0], serverApis[1], serverApis[2], serverApis[3], serverApis[4], serverApis[5]]);
  });
});

module.exports = app;
