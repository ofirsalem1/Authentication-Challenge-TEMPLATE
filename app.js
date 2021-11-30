const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// { email: "admin@email.com", name: "admin", password:"**hashed password**", isAdmin: true }.//the password must be:Rc123456!
const USERS = [{ email: 'admin@email.com', name: 'admin', password: '**hashed password**', isAdmin: true }];
const INFORMATION = []; // {email: ${email}, info: "${name} info"}
const REFRESHTOKENS = [];

router.post('/users/register', async (req, res) => {
  try {
    const { email, user, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (findIfExists(email)) {
      res.status(409).send('user already exists');
    } else {
      USERS.push({ email, name: user, password: hashedPassword, isAdmin: false });
      INFORMATION.push({ email, info: `${user} info` });
      res.status(201).send('Register Success');
    }
    console.log('INFORMATION', INFORMATION);
    console.log('USERS', USERS);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  res.status(200).send('accessToken, refreshToken , email, name, isAdmin');
});

module.exports = router;

const findIfExists = email => {
  for (let i of INFORMATION) {
    if (i.email === email) {
      return true;
    }
  }
  return false;
};
