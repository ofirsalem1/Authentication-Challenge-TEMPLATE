require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { USERS, INFORMATION, REFRESHTOKENS } = require('../db/db');
exports.registerFunc = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (findIfExists(email)) {
      res.status(409).send('user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      USERS.push({ email, name, password: hashedPassword, isAdmin: false });
      INFORMATION.push({ email, info: `${name} info` });
      res.status(201).send('Register Success');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.loginFunc = async (req, res) => {
  const { email, password } = req.body;
  const userObj = findIfExists(email);
  if (!userObj) {
    res.status(404).send('cannot find user');
  } else {
    const userDetails = await passwordChecker(password, userObj);
    if (userDetails) {
      const accessToken = jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50s' });
      const refreshToken = jwt.sign(userDetails, process.env.REFRESH_TOKEN_SECRET);
      userDetails.accessToken = accessToken;
      userDetails.refreshToken = refreshToken;
      REFRESHTOKENS.push(refreshToken);
      res.json({ ...userDetails });
    } else {
      res.status(403).send('User or Password incorrect');
    }
  }
};

exports.tokenValidateFunc = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).send('Access Token Required');
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Access Token');
    req.user = user;
    next();
    res.status(200).json({ valid: true });
  });
};

exports.refreshTokenFunc = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).send('Refresh Token Required');
  }
  if (!REFRESHTOKENS.includes(refreshToken)) {
    return res.status(403).send('Invalid Refresh Token');
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403)('Invalid Refresh Token');
    const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10s',
    });
    res.status(200).send({ accessToken });
    next();
  });
};

exports.logoutFunc = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(400).send('Refresh Token Required');
  }
  const refreshTokenIndex = REFRESHTOKENS.indexOf(refreshToken);
  console.log(refreshTokenIndex);
  if (refreshTokenIndex < 0) {
    return res.status(400).send('Invalid Refresh Token');
  }
  REFRESHTOKENS.splice(refreshTokenIndex, 1);
  res.status(200).send('User Logged Out Successfully');
};

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
