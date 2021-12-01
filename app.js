require('dotenv').config();
const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// { email: "admin@email.com", name: "admin", password:"**hashed password**", isAdmin: true }.//the password must be:Rc123456!
const USERS = [{ email: 'admin@email.com', name: 'admin', password: '$2b$10$v8ilFSe6pzCtytQChZD3meE3HrG1jW2yXv0ThrUnq8kAoTpTowAYa', isAdmin: true }];
const INFORMATION = []; // {email: ${email}, info: "${name} info"}
const REFRESHTOKENS = [];

router.post('/users/register', async (req, res) => {
  try {
    const { email, user, password } = req.body;
    if (findIfExists(email)) {
      res.status(409).send('user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      USERS.push({ email, name: user, password: hashedPassword, isAdmin: false });
      INFORMATION.push({ email, info: `${user} info` });
      res.status(201).send('Register Success');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const userObj = findIfExists(email);
  if (!userObj) {
    res.status(404).send('cannot find user');
  } else {
    const userDetails = await passwordChecker(password, userObj);
    if (userDetails) {
      const accessToken = jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
      const refreshToken = jwt.sign(userDetails, process.env.REFRESH_TOKEN_SECRET);
      userDetails.accessToken = accessToken;
      userDetails.refreshToken = refreshToken;
      res.json({ userDetails });
    } else {
      res.status(403).send('User or Password incorrect');
    }
  }
});

router.post('/users/tokenValidate', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (token == null) return res.status(401).send('Access Token Required');
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Access Token');
    console.log(user);
    res.status(200).json({ valid: true });
  });
});

module.exports = router;

const findIfExists = email => {
  for (let i of USERS) {
    if (i.email === email) {
      return i;
    }
  }
  return false;
};

const passwordChecker = async (password, userObj) => {
  try {
    if (await bcrypt.compare(password, userObj.password)) {
      return { email: userObj.email, name: userObj.name, isAdmin: userObj.isAdmin };
    } else {
      return false;
    }
  } catch (error) {
    res.status(500).json(error);
    return false;
  }
};

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }
